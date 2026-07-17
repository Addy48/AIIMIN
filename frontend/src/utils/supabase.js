/**
 * API-backed data client — drop-in replacement for supabase-js table access.
 *
 * Better Auth sessions do not populate Supabase auth.uid(), so direct PostgREST
 * RLS queries return empty/fail. All reads/writes go through /api/db with cookies.
 *
 * Supports the query-builder surface used across frontend/src:
 * select, insert, update, upsert, delete, eq, neq, gte, gt, lte, lt, in, is,
 * order, limit, maybeSingle, single, then → { data, error, count }.
 */
import { apiGet, apiPost, apiPatch, apiDelete } from './api';

function stripEmbedSelect(cols) {
    if (!cols || cols === '*') return '*';
    // Drop PostgREST embeds: "*, money_categories(name, icon, color)" → "*"
    return cols.replace(/,?\s*[a-z_][a-z0-9_]*\s*\([^)]*\)/gi, '').trim() || '*';
}

class QueryBuilder {
    constructor(table) {
        this.table = table;
        this._op = 'select';
        this._payload = null;
        this._onConflict = null;
        this._eq = {};
        this._neq = {};
        this._gte = {};
        this._gt = {};
        this._lte = {};
        this._lt = {};
        this._in = {};
        this._is = {};
        this._orderCol = 'created_at';
        this._ascending = false;
        this._limit = null;
        this._maybeSingle = false;
        this._single = false;
        this._countOnly = false;
        this._wantSelectReturn = false;
    }

    select(cols = '*', opts = {}) {
        if (opts?.count === 'exact' && opts?.head) {
            this._countOnly = true;
        }
        this._selectCols = stripEmbedSelect(cols);
        if (this._op === 'insert' || this._op === 'update' || this._op === 'upsert') {
            this._wantSelectReturn = true;
        } else {
            this._op = 'select';
        }
        return this;
    }

    insert(payload) {
        this._op = 'insert';
        this._payload = payload;
        return this;
    }

    update(payload) {
        this._op = 'update';
        this._payload = payload;
        return this;
    }

    upsert(payload, opts = {}) {
        this._op = 'upsert';
        this._payload = payload;
        this._onConflict = opts?.onConflict || 'id';
        return this;
    }

    delete() {
        this._op = 'delete';
        return this;
    }

    eq(col, val) { this._eq[col] = val; return this; }
    neq(col, val) { this._neq[col] = val; return this; }
    gte(col, val) { this._gte[col] = val; return this; }
    gt(col, val) { this._gt[col] = val; return this; }
    lte(col, val) { this._lte[col] = val; return this; }
    lt(col, val) { this._lt[col] = val; return this; }
    in(col, vals) { this._in[col] = Array.isArray(vals) ? vals : [vals]; return this; }
    is(col, val) { this._is[col] = val; return this; }

    order(col, opts = {}) {
        this._orderCol = col;
        this._ascending = opts?.ascending === true;
        return this;
    }

    limit(n) {
        this._limit = n;
        return this;
    }

    maybeSingle() {
        this._maybeSingle = true;
        return this;
    }

    single() {
        this._single = true;
        return this;
    }

    then(resolve, reject) {
        return this._execute().then(resolve, reject);
    }

    async _execute() {
        try {
            if (this._op === 'select' || this._countOnly) {
                return await this._doSelect();
            }
            if (this._op === 'insert') {
                const data = await apiPost(`/db/${this.table}`, this._payload);
                return this._shapeWrite(data);
            }
            if (this._op === 'upsert') {
                const data = await apiPost(`/db/${this.table}/upsert`, {
                    payload: this._payload,
                    onConflict: this._onConflict,
                });
                return this._shapeWrite(data);
            }
            if (this._op === 'update') {
                const where = { ...this._eq };
                const data = await apiPatch(`/db/${this.table}`, {
                    payload: this._payload,
                    where,
                });
                return this._shapeWrite(data);
            }
            if (this._op === 'delete') {
                await apiDelete(`/db/${this.table}`, { where: { ...this._eq } });
                return { data: null, error: null };
            }
            return { data: null, error: new Error(`Unsupported op: ${this._op}`) };
        } catch (err) {
            return { data: null, error: err, count: null };
        }
    }

    async _doSelect() {
        const params = {
            orderCol: this._orderCol,
            ascending: String(this._ascending),
        };
        if (Object.keys(this._eq).length) params.eq = JSON.stringify(this._eq);
        if (Object.keys(this._neq).length) params.neq = JSON.stringify(this._neq);
        if (Object.keys(this._gte).length) params.gte = JSON.stringify(this._gte);
        if (Object.keys(this._gt).length) params.gt = JSON.stringify(this._gt);
        if (Object.keys(this._lte).length) params.lte = JSON.stringify(this._lte);
        if (Object.keys(this._lt).length) params.lt = JSON.stringify(this._lt);
        if (Object.keys(this._in).length) params.in = JSON.stringify(this._in);
        if (Object.keys(this._is).length) params.is = JSON.stringify(this._is);
        if (this._limit != null) params.limit = String(this._limit);
        if (this._maybeSingle || this._single) params.maybeSingle = 'true';
        if (this._countOnly) params.count = 'true';

        const data = await apiGet(`/db/${this.table}`, { params });

        if (this._countOnly) {
            return { data: null, error: null, count: data?.count ?? 0 };
        }

        if (this._single) {
            if (!data) {
                return { data: null, error: Object.assign(new Error('No rows'), { code: 'PGRST116' }) };
            }
            return { data, error: null };
        }

        if (this._maybeSingle) {
            return { data: data || null, error: null };
        }

        return { data: Array.isArray(data) ? data : (data ? [data] : []), error: null };
    }

    _shapeWrite(data) {
        if (this._single) {
            const row = Array.isArray(data) ? data[0] : data;
            return { data: row || null, error: row ? null : new Error('No rows returned') };
        }
        if (this._maybeSingle) {
            const row = Array.isArray(data) ? data[0] : data;
            return { data: row || null, error: null };
        }
        if (this._wantSelectReturn || this._op === 'insert' || this._op === 'upsert' || this._op === 'update') {
            return { data: Array.isArray(data) ? data : (data ? [data] : []), error: null };
        }
        return { data: null, error: null };
    }
}

const authStub = {
    getSession: async () => ({ data: { session: null }, error: null }),
    getUser: async () => ({ data: { user: null }, error: null }),
    signOut: async () => ({ error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe() {} } } }),
};

const supabase = {
    from(table) {
        return new QueryBuilder(table);
    },
    auth: authStub,
};

export default supabase;
export { supabase };
