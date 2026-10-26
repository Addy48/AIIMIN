package aiimin.core.database

import androidx.room3.Room
import androidx.sqlite.driver.bundled.BundledSQLiteDriver
import androidx.sqlite.execSQL
import androidx.test.ext.junit.runners.AndroidJUnit4
import androidx.test.platform.app.InstrumentationRegistry
import com.google.common.truth.Truth.assertThat
import kotlinx.coroutines.runBlocking
import org.json.JSONObject
import org.junit.Test
import org.junit.runner.RunWith

/**
 * PRD Part 5 Phase 1, Done when: "All existing documents appear as version 1 after upgrade with nothing lost
 * (migration test on a database with data)". Builds a real v11 database from the exported schema, puts two
 * documents in it, then opens it with today's AppDatabase so the 11 -> 12 migration runs.
 */
@RunWith(AndroidJUnit4::class)
class DocCoverMigrationTest {
    @Test fun existingDocumentsBecomeVersionOneOfTheirOwnCoverWithNothingLost(): Unit = runBlocking {
        val ctx = InstrumentationRegistry.getInstrumentation().targetContext
        val testCtx = InstrumentationRegistry.getInstrumentation().context
        val path = ctx.getDatabasePath("cover-migration-test.db").apply { parentFile?.mkdirs(); delete() }.absolutePath
        val schema = JSONObject(testCtx.assets.open("aiimin.core.database.AppDatabase/11.json").bufferedReader().readText()).getJSONObject("database")

        BundledSQLiteDriver().open(path).use { c ->
            val entities = schema.getJSONArray("entities")
            for (i in 0 until entities.length()) {
                val e = entities.getJSONObject(i)
                val table = e.getString("tableName")
                c.execSQL(e.getString("createSql").replace("\${TABLE_NAME}", table))
                e.optJSONArray("indices")?.let { ix -> for (j in 0 until ix.length()) c.execSQL(ix.getJSONObject(j).getString("createSql").replace("\${TABLE_NAME}", table)) }
            }
            val setup = schema.getJSONArray("setupQueries")
            for (i in 0 until setup.length()) c.execSQL(setup.getString(i))
            c.execSQL("INSERT OR REPLACE INTO room_master_table (id,identity_hash) VALUES(42, '${schema.getString("identityHash")}')")
            c.execSQL(
                "INSERT INTO docs (id, owner, sha256, title, category, mime, ext, sizeBytes, path, encrypted, sensitive, text, expires, number, vehicle, pages, version, createdAt, openedAt, deleted) VALUES " +
                    "('d1','me','abc','ICICI Lombard car policy','Insurance','application/pdf','pdf',2048,'d1.pdf',0,0,'Private Car Package Policy','2026-10-13','3001/ABC','MH12AB1234',2,1,1700000000000,NULL,0)," +
                    "('d2','me','def','PAN card','Identity','image/jpeg','jpg',512,'d2.jpg.enc',1,1,'',NULL,'ABCDE1234F',NULL,1,1,1700000001000,1700000002000,0)",
            )
            c.execSQL("PRAGMA user_version = 11")
        }

        val db = Room.databaseBuilder<AppDatabase>(ctx, path).setDriver(BundledSQLiteDriver()).build()
        try {
            val docs = db.vault().allNow().sortedBy { it.id }
            assertThat(docs.map { it.id }).containsExactly("d1", "d2").inOrder()
            val car = docs[0]
            assertThat(car.title).isEqualTo("ICICI Lombard car policy")
            assertThat(car.expires).isEqualTo("2026-10-13")
            assertThat(car.number).isEqualTo("3001/ABC")
            assertThat(car.vehicle).isEqualTo("MH12AB1234")
            assertThat(car.pages).isEqualTo(2)
            assertThat(car.sizeBytes).isEqualTo(2048)
            val pan = docs[1]
            assertThat(pan.encrypted).isTrue()
            assertThat(pan.openedAt).isEqualTo(1700000002000)
            docs.forEach {
                assertThat(it.version).isEqualTo(1)
                assertThat(it.current).isTrue()
                assertThat(it.coverId).isNull()
                assertThat(it.cover).isEqualTo(it.id)
            }
            assertThat(db.vault().currentWithExpiry().map { it.id }).containsExactly("d1")
            assertThat(db.vault().cover("d1").map { it.id }).containsExactly("d1")
        } finally {
            db.close()
            ctx.deleteDatabase("cover-migration-test.db")
        }
    }
}
