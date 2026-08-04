package aiimin.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.runtime.getValue
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import aiimin.app.ui.AiiminShell
import aiimin.core.data.ConfigStore
import aiimin.designsystem.theme.AiiminTheme
import dagger.hilt.android.AndroidEntryPoint
import javax.inject.Inject

@AndroidEntryPoint
class MainActivity : ComponentActivity() {

    @Inject lateinit var config: ConfigStore

    override fun onCreate(savedInstanceState: Bundle?) {
        enableEdgeToEdge()
        super.onCreate(savedInstanceState)
        setContent {
            val prefs by config.state.collectAsStateWithLifecycle()
            AiiminTheme(darkTheme = prefs.darkTheme) {
                AiiminShell()
            }
        }
    }
}
