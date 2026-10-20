package aiimin.feature.onboarding

import aiimin.designsystem.theme.LightPalette
import android.content.Context
import android.graphics.Paint
import android.graphics.pdf.PdfDocument
import android.os.Bundle
import android.os.CancellationSignal
import android.os.ParcelFileDescriptor
import android.print.PageRange
import android.print.PrintAttributes
import android.print.PrintDocumentAdapter
import android.print.PrintDocumentInfo
import android.print.PrintManager
import android.print.pdf.PrintedPdfDocument
import androidx.compose.ui.graphics.toArgb
import java.io.FileOutputStream

/**
 * The printable "Start Small" planner on the under-18 screen (PRD D7, Part 23): one page, a week of one small
 * thing a day, drawn on the phone and handed to Android's print screen (which can also save a PDF). Nothing is stored.
 */
object StartSmallPlanner {
    fun print(context: Context) {
        val pm = context.getSystemService(Context.PRINT_SERVICE) as? PrintManager ?: return
        runCatching { pm.print("Start Small", Adapter(context), PrintAttributes.Builder().setMediaSize(PrintAttributes.MediaSize.ISO_A4).build()) }
    }

    private class Adapter(private val context: Context) : PrintDocumentAdapter() {
        private var attrs: PrintAttributes? = null

        override fun onLayout(old: PrintAttributes?, new: PrintAttributes, cancel: CancellationSignal?, cb: LayoutResultCallback, extras: Bundle?) {
            attrs = new
            if (cancel?.isCanceled == true) { cb.onLayoutCancelled(); return }
            cb.onLayoutFinished(PrintDocumentInfo.Builder("start-small.pdf").setContentType(PrintDocumentInfo.CONTENT_TYPE_DOCUMENT).setPageCount(1).build(), true)
        }

        override fun onWrite(pages: Array<out PageRange>, dest: ParcelFileDescriptor, cancel: CancellationSignal?, cb: WriteResultCallback) {
            val doc = PrintedPdfDocument(context, attrs ?: PrintAttributes.Builder().setMediaSize(PrintAttributes.MediaSize.ISO_A4).build())
            val page = doc.startPage(0)
            draw(page)
            doc.finishPage(page)
            runCatching { FileOutputStream(dest.fileDescriptor).use { doc.writeTo(it) } }
                .onSuccess { cb.onWriteFinished(arrayOf(PageRange.ALL_PAGES)) }
                .onFailure { cb.onWriteFailed(it.message) }
            doc.close()
        }

        private fun draw(page: PdfDocument.Page) {
            val cv = page.canvas
            val w = page.info.pageWidth.toFloat()
            val ink = LightPalette.text.toArgb()
            val faint = LightPalette.border.toArgb()
            val title = Paint(Paint.ANTI_ALIAS_FLAG).apply { color = ink; textSize = 28f; isFakeBoldText = true }
            val body = Paint(Paint.ANTI_ALIAS_FLAG).apply { color = ink; textSize = 12f }
            val line = Paint(Paint.ANTI_ALIAS_FLAG).apply { color = faint; strokeWidth = 1f; style = Paint.Style.STROKE }
            val m = 48f
            cv.drawText("Start Small", m, 80f, title)
            cv.drawText("One small thing a day. Tick it when it's done. That's all.", m, 106f, body)
            var y = 150f
            (1..7).forEach { day ->
                cv.drawText("Day $day", m, y + 18f, body)
                cv.drawLine(m + 70f, y + 22f, w - m - 40f, y + 22f, line)
                cv.drawRect(w - m - 24f, y + 4f, w - m, y + 28f, line)
                y += 64f
            }
            cv.drawText("Ideas: drink a glass of water · walk to the gate · read one page · write one line.", m, y + 24f, body)
        }
    }
}
