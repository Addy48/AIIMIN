package `in`.aiimin.app.ui.settings

import android.content.Intent
import android.net.Uri
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.material3.Card
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.SegmentedButton
import androidx.compose.material3.SegmentedButtonDefaults
import androidx.compose.material3.SingleChoiceSegmentedButtonRow
import androidx.compose.material3.Switch
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.fragment.app.FragmentActivity
import `in`.aiimin.app.AppContainer
import `in`.aiimin.app.data.prefs.ThemeMode
import `in`.aiimin.app.security.BiometricHelper
import `in`.aiimin.app.ui.components.AiiminPrimaryButton
import `in`.aiimin.app.ui.components.AiiminTextButton
import `in`.aiimin.app.ui.components.ScreenChrome
import `in`.aiimin.app.ui.components.SyncBanner
import kotlinx.coroutines.launch

@Composable
fun SettingsScreen(container: AppContainer, onBack: () -> Unit) {
    val vault by container.repository.vault.collectAsState()
    val syncUi by container.repository.syncUi.collectAsState()
    val themeMode by container.appPrefs.themeMode.collectAsState(initial = ThemeMode.SYSTEM)
    val biometricEnabled by container.appPrefs.biometricUnlockEnabled.collectAsState(initial = false)
    val scope = rememberCoroutineScope()
    val context = LocalContext.current
    val activity = context as? FragmentActivity
    var biometricError by remember { mutableStateOf<String?>(null) }
    val user = vault.user
    val themeLabels = listOf("System", "Light", "Dark")
    val themeIndex = when (themeMode) {
        ThemeMode.SYSTEM -> 0
        ThemeMode.LIGHT -> 1
        ThemeMode.DARK -> 2
    }

    ScreenChrome {
        Column(Modifier.fillMaxSize()) {
            SyncBanner(
                syncUi = syncUi,
                onRetry = { scope.launch { container.repository.syncAll() } },
            )
            LazyColumn(
            modifier = Modifier.fillMaxSize(),
            contentPadding = PaddingValues(24.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp),
        ) {
            item { Text("Settings", style = MaterialTheme.typography.headlineMedium) }
            item {
                Card(Modifier.fillMaxWidth()) {
                    Column(Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                        Text("Profile", style = MaterialTheme.typography.titleMedium)
                        Text(user?.name ?: "—", style = MaterialTheme.typography.bodyLarge)
                        Text(user?.email ?: "—", style = MaterialTheme.typography.bodyMedium, color = MaterialTheme.colorScheme.onSurfaceVariant)
                        Text("Life Arc · edit on desktop", style = MaterialTheme.typography.labelMedium, color = MaterialTheme.colorScheme.onSurfaceVariant)
                    }
                }
            }
            item {
                Card(Modifier.fillMaxWidth()) {
                    Column(Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
                        Text("Appearance", style = MaterialTheme.typography.titleMedium)
                        SingleChoiceSegmentedButtonRow(Modifier.fillMaxWidth()) {
                            themeLabels.forEachIndexed { index, label ->
                                SegmentedButton(
                                    selected = themeIndex == index,
                                    onClick = {
                                        scope.launch {
                                            container.appPrefs.setThemeMode(
                                                when (index) {
                                                    1 -> ThemeMode.LIGHT
                                                    2 -> ThemeMode.DARK
                                                    else -> ThemeMode.SYSTEM
                                                },
                                            )
                                        }
                                    },
                                    shape = SegmentedButtonDefaults.itemShape(index, themeLabels.size),
                                ) { Text(label) }
                            }
                        }
                    }
                }
            }
            item {
                Card(Modifier.fillMaxWidth()) {
                    Column(Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
                        Text("Security", style = MaterialTheme.typography.titleMedium)
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                        ) {
                            Column(Modifier.weight(1f)) {
                                Text("Biometric unlock", style = MaterialTheme.typography.bodyLarge)
                                Text(
                                    "Fingerprint or face when reopening the app",
                                    style = MaterialTheme.typography.bodySmall,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                                )
                            }
                            Switch(
                                checked = biometricEnabled,
                                onCheckedChange = { enabled ->
                                    biometricError = null
                                    if (!enabled) {
                                        scope.launch { container.appPrefs.setBiometricUnlockEnabled(false) }
                                        return@Switch
                                    }
                                    val host = activity
                                    if (host == null || !BiometricHelper.canAuthenticate(host)) {
                                        biometricError = "Biometrics not available on this device"
                                        return@Switch
                                    }
                                    BiometricHelper.showPrompt(
                                        activity = host,
                                        title = "Enable biometric unlock",
                                        subtitle = "Confirm to turn on quick unlock",
                                        onSuccess = {
                                            scope.launch { container.appPrefs.setBiometricUnlockEnabled(true) }
                                        },
                                        onError = { biometricError = it },
                                    )
                                },
                            )
                        }
                        biometricError?.let {
                            Text(it, color = MaterialTheme.colorScheme.error, style = MaterialTheme.typography.bodySmall)
                        }
                    }
                }
            }
            item {
                Card(Modifier.fillMaxWidth()) {
                    Column(Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                        Text("Sync", style = MaterialTheme.typography.titleMedium)
                        AiiminTextButton(
                            text = "Sync now",
                            onClick = { scope.launch { container.repository.syncAll() } },
                        )
                        AiiminTextButton(
                            text = "Open web dashboard →",
                            onClick = {
                                context.startActivity(Intent(Intent.ACTION_VIEW, Uri.parse("https://aiimin.in/overview")))
                            },
                        )
                    }
                }
            }
            item {
                AiiminPrimaryButton(
                    text = "Sign out",
                    onClick = { scope.launch { container.repository.signOut() } },
                )
            }
            item {
                OutlinedButton(onClick = onBack, modifier = Modifier.fillMaxWidth()) {
                    Text("Back to More")
                }
            }
        }
        }
    }
}
