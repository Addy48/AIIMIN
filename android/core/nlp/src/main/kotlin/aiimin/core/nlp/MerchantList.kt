package aiimin.core.nlp

/**
 * The built-in merchant list (Part 5 Phase 2): well-known Indian payees and shop words → a spending category,
 * read from `merchants_in.tsv` on the phone. User rules and payee memory run before it; nothing is sent anywhere.
 *
 * File format: `@Category` starts a block; each line is one merchant, its spellings separated by `|`; `#` is a comment.
 * A spelling that starts with `~` is a shop word ("chemist", "online order"), not a brand: any brand found beats it,
 * so "KFC online order" is Food. Among brands, and among shop words, the longest wins.
 */
object MerchantList {
    data class Entry(val category: String, val words: List<String>, val generic: Boolean = false) {
        /** The name with spaces removed ("bigbasket"), for joined SMS names and clash checks. */
        val key: String = words.joinToString("")
    }

    data class Hit(val category: String, val pattern: String)

    /** A merchant this long may match the start of a joined word ("SWIGGYINSTAMART"); shorter ones need whole words. */
    private const val PREFIX_MIN = 5

    val entries: List<Entry> by lazy {
        val text = MerchantList::class.java.getResourceAsStream("/aiimin/core/nlp/merchants_in.tsv")?.bufferedReader()?.use { it.readText() }.orEmpty()
        parse(text)
    }

    fun parse(text: String): List<Entry> {
        var category = ""
        val out = ArrayList<Entry>()
        text.lineSequence().map { it.trim() }.filter { it.isNotEmpty() && !it.startsWith("#") }.forEach { line ->
            if (line.startsWith("@")) { category = line.drop(1).trim(); return@forEach }
            if (category.isEmpty()) return@forEach
            line.split('|').map { it.trim() }.forEach { a ->
                val w = words(a.removePrefix("~"))
                if (w.isNotEmpty()) out += Entry(category, w, generic = a.startsWith("~"))
            }
        }
        return out
    }

    /** Lower case, apostrophes dropped ("Domino's" → "dominos"), everything else not a letter or digit a space. */
    fun words(s: String): List<String> = s.lowercase().replace("'", "").replace("’", "").replace("&", " and ")
        .split(Regex("""[^a-z0-9]+""")).filter { it.isNotEmpty() }

    /** The category of the longest merchant found in the name (or, failing that, in the UPI handle's letters). */
    fun categoryOf(name: String, upiId: String? = null): Hit? =
        best(words(name)) ?: upiId?.substringBefore('@')?.let { best(words(it.replace(Regex("""\d+"""), " "))) }

    private fun best(w: List<String>): Hit? {
        if (w.isEmpty()) return null
        var hit: Entry? = null
        for (e in entries) {
            val h = hit
            if (h != null && (h.generic == e.generic && h.key.length >= e.key.length || !h.generic && e.generic)) continue
            if (matches(w, e)) hit = e
        }
        return hit?.let { Hit(it.category, it.words.joinToString(" ")) }
    }

    private fun matches(w: List<String>, e: Entry): Boolean {
        val p = e.words
        // Whole words in a row: "metro" in "delhi metro rail".
        for (i in 0..w.size - p.size) if ((p.indices).all { w[i + it] == p[it] }) return true
        // Joined: "swiggyinstamart" starts with "swiggy", "big basket" is "bigbasket".
        if (e.key.length < PREFIX_MIN) return false
        for (i in w.indices) {
            val joined = StringBuilder()
            for (j in i until w.size) {
                joined.append(w[j])
                if (joined.length >= e.key.length) break
            }
            if (joined.startsWith(e.key)) return true
        }
        return false
    }
}
