package aiimin.core.data.vault

import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.graphics.Color
import android.graphics.pdf.PdfRenderer
import android.os.ParcelFileDescriptor
import com.google.android.gms.tasks.Task
import com.google.mlkit.vision.common.InputImage
import com.google.mlkit.vision.text.TextRecognition
import com.google.mlkit.vision.text.devanagari.DevanagariTextRecognizerOptions
import com.google.mlkit.vision.text.latin.TextRecognizerOptions
import java.io.File
import java.util.zip.ZipFile
import javax.inject.Inject
import javax.inject.Singleton
import kotlin.coroutines.resume
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.suspendCancellableCoroutine
import kotlinx.coroutines.withContext

enum class DocKind { PDF, DOCX, SHEET, CSV, IMAGE, TEXT, OTHER }

fun kindOf(ext: String, mime: String): DocKind = when {
    ext == "pdf" || mime == "application/pdf" -> DocKind.PDF
    ext == "docx" -> DocKind.DOCX
    ext in setOf("xlsx", "xls") -> DocKind.SHEET
    ext == "csv" -> DocKind.CSV
    mime.startsWith("image/") || ext in setOf("jpg", "jpeg", "png", "webp", "heic", "gif") -> DocKind.IMAGE
    ext in setOf("txt", "md", "json") || mime.startsWith("text/") -> DocKind.TEXT
    else -> DocKind.OTHER
}

/**
 * Pulls readable text out of a file, on the device. PDFs are rendered and read
 * with ML Kit (works for scans and digital PDFs alike), Word and Excel are
 * unzipped, images are OCR'd in English and Hindi.
 */
@Singleton
class TextExtractor @Inject constructor() {

    suspend fun extract(file: File, kind: DocKind): String = withContext(Dispatchers.IO) {
        runCatching {
            when (kind) {
                DocKind.TEXT, DocKind.CSV -> file.readText().take(MAX)
                DocKind.DOCX -> docx(file)
                DocKind.SHEET -> if (file.extension.lowercase() == "xlsx") xlsx(file) else ""
                DocKind.PDF -> pdf(file)
                DocKind.IMAGE -> BitmapFactory.decodeFile(file.absolutePath)?.let { ocr(it) }.orEmpty()
                DocKind.OTHER -> ""
            }
        }.getOrDefault("")
    }

    private fun docx(file: File): String = ZipFile(file).use { z ->
        val xml = z.getEntry("word/document.xml")?.let { z.getInputStream(it).bufferedReader().readText() } ?: return ""
        xml.replace(Regex("</w:p>"), "\n").replace(Regex("<w:tab/>"), "\t").replace(Regex("<[^>]+>"), "").decodeXml().take(MAX)
    }

    private fun xlsx(file: File): String = ZipFile(file).use { z ->
        val strings = z.getEntry("xl/sharedStrings.xml")?.let { z.getInputStream(it).bufferedReader().readText() }
            ?.let { Regex("<t[^>]*>(.*?)</t>", RegexOption.DOT_MATCHES_ALL).findAll(it).map { m -> m.groupValues[1].decodeXml() }.toList() }
            .orEmpty()
        strings.joinToString("\n").take(MAX)
    }

    private suspend fun pdf(file: File): String {
        val sb = StringBuilder()
        ParcelFileDescriptor.open(file, ParcelFileDescriptor.MODE_READ_ONLY).use { fd ->
            PdfRenderer(fd).use { r ->
                for (i in 0 until minOf(r.pageCount, 4)) {
                    r.openPage(i).use { page ->
                        val scale = 2
                        val bmp = Bitmap.createBitmap(page.width * scale, page.height * scale, Bitmap.Config.ARGB_8888)
                        bmp.eraseColor(Color.WHITE)
                        page.render(bmp, null, null, PdfRenderer.Page.RENDER_MODE_FOR_DISPLAY)
                        sb.append(ocr(bmp)).append('\n')
                        bmp.recycle()
                    }
                }
            }
        }
        return sb.toString().take(MAX)
    }

    suspend fun pageCount(file: File): Int = withContext(Dispatchers.IO) {
        runCatching { ParcelFileDescriptor.open(file, ParcelFileDescriptor.MODE_READ_ONLY).use { PdfRenderer(it).use { r -> r.pageCount } } }.getOrDefault(1)
    }

    /** Latin first; Devanagari added when the page has Hindi. */
    private suspend fun ocr(bmp: Bitmap): String {
        val image = InputImage.fromBitmap(bmp, 0)
        val latin = TextRecognition.getClient(TextRecognizerOptions.DEFAULT_OPTIONS).process(image).awaitOrNull()?.text.orEmpty()
        val hindi = TextRecognition.getClient(DevanagariTextRecognizerOptions.Builder().build()).process(image).awaitOrNull()?.text.orEmpty()
        val hasDevanagari = hindi.any { it in 'ऀ'..'ॿ' }
        return if (hasDevanagari) latin + "\n" + hindi else latin
    }

    private suspend fun <T> Task<T>.awaitOrNull(): T? = suspendCancellableCoroutine { c ->
        addOnSuccessListener { if (c.isActive) c.resume(it) }
        addOnFailureListener { if (c.isActive) c.resume(null) }
    }

    private fun String.decodeXml() = replace("&amp;", "&").replace("&lt;", "<").replace("&gt;", ">").replace("&quot;", "\"").replace("&apos;", "'")

    private companion object {
        const val MAX = 60_000
    }
}
