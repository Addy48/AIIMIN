package aiimin.core.data

import aiimin.core.data.notes.Checklist
import aiimin.core.data.notes.ImportedNote
import aiimin.core.data.notes.KeepTakeout
import aiimin.core.data.notes.MarkdownNote
import aiimin.core.data.notes.NoteImport
import aiimin.core.data.notes.NoteSearch
import aiimin.core.data.notes.htmlToText
import aiimin.core.database.NoteEntity
import com.google.common.truth.Truth.assertThat
import org.junit.Test

/** Part 11.6: Keep Takeout and Markdown import, export all and re-import, checklists, search that never shows locked text. */
class NoteFilesTest {
    private val keepChecklist = """
        {"color":"GREEN","isTrashed":false,"isPinned":true,"isArchived":false,
         "listContent":[{"text":"Milk","isChecked":true},{"text":"Bread","isChecked":false}],
         "title":"Groceries","userEditedTimestampUsec":1729412345000000,"createdTimestampUsec":1729400000000000,
         "labels":[{"name":"Home"},{"name":"Weekly shop"}]}
    """.trimIndent()

    private val keepText = """
        {"color":"DEFAULT","isTrashed":false,"isPinned":false,"isArchived":true,
         "textContent":"Call the CA about advance tax.\nBring PAN.","title":"",
         "userEditedTimestampUsec":1729412345000000,"createdTimestampUsec":1729400000000000,
         "attachments":[{"filePath":"1a2b.jpg","mimetype":"image/jpeg"}]}
    """.trimIndent()

    @Test fun `a Keep checklist keeps its title, ticks, labels, pin, colour and dates`() {
        val n = KeepTakeout.parse(keepChecklist, "Groceries.json")!!
        assertThat(n.title).isEqualTo("Groceries")
        assertThat(n.body).isEqualTo("- [x] Milk\n- [ ] Bread\n\n#home #weekly-shop")
        assertThat(n.pinned).isTrue()
        assertThat(n.color).isEqualTo("leaf")
        assertThat(n.createdAt).isEqualTo(1729400000000L)
        assertThat(n.updatedAt).isEqualTo(1729412345000L)
        assertThat(n.sourceApp).isEqualTo("keep")
    }

    @Test fun `a Keep text note with no title takes its first line, keeps archive and pictures`() {
        val n = KeepTakeout.parse(keepText, "Call the CA.json")!!
        assertThat(n.title).isEqualTo("Call the CA about advance tax.")
        assertThat(n.body).isEqualTo("Call the CA about advance tax.\nBring PAN.")
        assertThat(n.archived).isTrue()
        assertThat(n.attachments).containsExactly("1a2b.jpg")
    }

    @Test fun `trashed Keep notes and files that are not notes are skipped`() {
        assertThat(KeepTakeout.parse(keepText.replace("\"isTrashed\":false", "\"isTrashed\":true"), "x.json")).isNull()
        assertThat(KeepTakeout.parse("""{"labels":[{"name":"x"}]}""", "Labels.json")).isNull()
        assertThat(KeepTakeout.parse("not json", "x.json")).isNull()
    }

    @Test fun `the same Keep note gives the same import key, so a second import adds nothing`() {
        val a = KeepTakeout.parse(keepChecklist, "Groceries.json")!!
        val b = KeepTakeout.parse(keepChecklist, "Groceries(1).json")!!
        assertThat(a.importKey).isEqualTo(b.importKey)
        val plan = NoteImport.plan(listOf(a, b, KeepTakeout.parse(keepText, "y.json")!!), existingKeys = setOf(a.importKey), existingIds = emptySet())
        assertThat(plan.fresh.map { it.title }).containsExactly("Call the CA about advance tax.")
        assertThat(plan.already).isEqualTo(2)
    }

    @Test fun `in a Takeout folder the HTML twins and Labels txt are left out`() {
        val paths = listOf("Takeout/Keep/A.json", "Takeout/Keep/A.html", "Takeout/Keep/Labels.txt", "Takeout/Keep/B.json", "notes/C.html", "notes/Labels.txt")
        assertThat(NoteImport.pick(paths)).containsExactly("Takeout/Keep/A.json", "Takeout/Keep/B.json", "notes/C.html", "notes/Labels.txt").inOrder()
    }

    @Test fun `a plain Markdown or text file becomes a note titled by its heading or file name`() {
        val md = MarkdownNote.parse("Trip ideas.md", "# Goa in March\n- [ ] Book train\nBeach #travel")
        assertThat(md.title).isEqualTo("Goa in March")
        assertThat(md.body).isEqualTo("- [ ] Book train\nBeach #travel")
        val txt = MarkdownNote.parse("Wifi password.txt", "router in the hall")
        assertThat(txt.title).isEqualTo("Wifi password")
        assertThat(txt.sourceApp).isEqualTo("file")
    }

    @Test fun `an Apple Notes HTML export reads as text`() {
        assertThat(htmlToText("<div><b>Shopping</b></div><div>eggs &amp; bread<br>tea</div><ul><li>one</li></ul>")).isEqualTo("Shopping\neggs & bread\ntea\n- one")
        val n = MarkdownNote.parse("Shopping.html", "<html><body><div>Shopping</div><div>eggs</div></body></html>")
        assertThat(n.title).isEqualTo("Shopping")
        assertThat(n.sourceApp).isEqualTo("apple")
    }

    @Test fun `export then re-import gives back the same note`() {
        val note = NoteEntity(
            id = "n-1", title = "Groceries", body = "- [x] Milk\n- [ ] Bread\n#home", tags = "[\"home\"]", pinned = true,
            createdAt = 1729400000000L, updatedAt = 1729412345000L, color = "leaf", archived = false,
        )
        val text = MarkdownNote.export(note)
        assertThat(text).startsWith("---\n")
        val back = MarkdownNote.parse(MarkdownNote.fileName(note), text)
        assertThat(back.title).isEqualTo(note.title)
        assertThat(back.body).isEqualTo(note.body)
        assertThat(back.pinned).isTrue()
        assertThat(back.color).isEqualTo("leaf")
        assertThat(back.createdAt).isEqualTo(note.createdAt)
        assertThat(back.updatedAt).isEqualTo(note.updatedAt)
        assertThat(back.id).isEqualTo("n-1")
        assertThat(back.sourceApp).isEqualTo("aiimin")
        // the note is already here: nothing new
        assertThat(NoteImport.plan(listOf(back), emptySet(), existingIds = setOf("n-1")).fresh).isEmpty()
    }

    @Test fun `file names are safe and unique`() {
        val a = NoteEntity("abcdef12-0000", "Tax: Q3 / advance?", "", createdAt = 1, updatedAt = 1)
        assertThat(MarkdownNote.fileName(a)).isEqualTo("Tax Q3 advance-abcdef12.md")
    }

    @Test fun `move done to bottom keeps the order of the rest`() {
        assertThat(Checklist.moveDoneToBottom("Shop\n- [x] Milk\n- [ ] Bread\n- [x] Eggs\n- [ ] Tea"))
            .isEqualTo("Shop\n- [ ] Bread\n- [ ] Tea\n- [x] Milk\n- [x] Eggs")
        assertThat(Checklist.move(listOf("a", "b", "c", "d"), from = 0, to = 2)).containsExactly("b", "c", "a", "d").inOrder()
    }

    @Test fun `search never matches a locked note, and filters by tag, colour and archive`() {
        val open = NoteEntity("1", "Trip", "Goa #travel", tags = "[\"travel\"]", createdAt = 1, updatedAt = 1, color = "sun")
        val locked = NoteEntity("2", "", "", createdAt = 1, updatedAt = 1, locked = true, cipher = "x", iv = "y")
        val scanned = NoteEntity("3", "Receipt", "", createdAt = 1, updatedAt = 1, attachments = """[{"file":"a.jpg","mime":"image/jpeg","text":"GSTIN 27AAAPL"}]""")
        val all = listOf(open, locked, scanned)
        assertThat(NoteSearch.filter(all, "goa", null, null).map { it.id }).containsExactly("1")
        assertThat(NoteSearch.filter(all, "", null, null).map { it.id }).containsExactly("1", "2", "3")
        assertThat(NoteSearch.filter(all, "x", null, null).map { it.id }).isEmpty()
        assertThat(NoteSearch.filter(all, "gstin", null, null).map { it.id }).containsExactly("3")
        assertThat(NoteSearch.filter(all, "", "travel", null).map { it.id }).containsExactly("1")
        assertThat(NoteSearch.filter(all, "", null, "sun").map { it.id }).containsExactly("1")
    }

    @Test fun `sort it offers only clear tasks and payments`() {
        val now = java.time.LocalDateTime.of(2026, 10, 21, 10, 0)
        val chips = aiimin.core.data.notes.SortIt.chips("Trip plan\n- [ ] call CA tomorrow 4 pm\n- 240 lunch\nthe sea was lovely\n#travel", now)
        assertThat(chips.map { it.kind.name }).containsExactly("TASK", "EXPENSE")
        assertThat(chips.map { it.line }).containsExactly("call CA tomorrow 4 pm", "240 lunch")
    }
}
