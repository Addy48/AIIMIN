package aiimin.feature.money

import aiimin.core.data.money.MoneyRepository
import aiimin.designsystem.component.AppButton
import aiimin.designsystem.component.AppSheet
import aiimin.designsystem.component.ButtonKind
import aiimin.designsystem.component.Pill
import aiimin.designsystem.nav.LocalToaster
import aiimin.designsystem.theme.Aiimin
import android.Manifest
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import java.time.YearMonth
import java.time.format.TextStyle
import java.util.Locale
import kotlinx.coroutines.launch

/**
 * "Bring in past bank messages": pick the month to start from, AIIMIN reads the SMS inbox from
 * that month's first day, parses bank alerts on the phone and drops them into Review. Alerts older
 * than the chosen month are ignored from then on, so monitoring starts exactly where you want.
 */
@OptIn(ExperimentalLayoutApi::class)
@Composable
fun SmsImportSheet(
    canRead: () -> Boolean,
    import: suspend (YearMonth) -> MoneyRepository.SmsImport?,
    onDismiss: () -> Unit,
) {
    val toaster = LocalToaster.current
    val scope = rememberCoroutineScope()
    val now = YearMonth.now()
    val months = (0..3).map { now.minusMonths(it.toLong()) }
    var from by remember { mutableStateOf(now) }
    var busy by remember { mutableStateOf(false) }
    fun name(m: YearMonth) = m.month.getDisplayName(TextStyle.FULL, Locale.ENGLISH) + if (m.year != now.year) " ${m.year}" else ""
    fun run() {
        busy = true
        scope.launch {
            val r = import(from)
            busy = false
            when {
                r == null -> toaster.show("AIIMIN needs permission to read SMS")
                r.added == 0 -> toaster.show(if (r.duplicates > 0) "Nothing new since ${name(from)} 1 · ${r.duplicates} already in Review" else "No bank messages found since ${name(from)} 1")
                else -> toaster.show("${r.added} payment${if (r.added == 1) "" else "s"} since ${name(from)} 1 are waiting in Review")
            }
            if (r != null) onDismiss()
        }
    }
    val permission = rememberLauncherForActivityResult(ActivityResultContracts.RequestPermission()) { ok -> if (ok) run() else toaster.show("Without SMS access, only new bank alerts are read") }
    AppSheet(onDismiss, title = "Bring in past bank messages") {
        Text(
            "Start from the month you want AIIMIN to track. Bank messages from its first day are read on this phone, never uploaded, and wait in Review until you approve them. Older alerts are ignored from now on.",
            style = Aiimin.type.body,
        )
        Text("Start from", style = Aiimin.type.label, modifier = Modifier.padding(top = 16.dp, bottom = 8.dp))
        FlowRow(horizontalArrangement = Arrangement.spacedBy(8.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
            months.forEachIndexed { i, m -> Pill(if (i == 0) "This month · ${name(m)}" else name(m), from == m, { from = m }) }
        }
        AppButton(
            if (busy) "Reading messages…" else "Read messages from ${name(from)} 1",
            { if (canRead()) run() else permission.launch(Manifest.permission.READ_SMS) },
            enabled = !busy,
            modifier = Modifier.fillMaxWidth().padding(top = 18.dp),
        )
        AppButton("Not now", onDismiss, kind = ButtonKind.GHOST, modifier = Modifier.fillMaxWidth().padding(top = 6.dp, bottom = 8.dp))
    }
}
