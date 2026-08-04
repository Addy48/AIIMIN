package aiimin.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.runtime.getValue
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import aiimin.app.ui.AiiminShell
import aiimin.core.data.ConfigStore
import aiimin.core.data.OnboardingStore
import aiimin.designsystem.theme.AiiminTheme
import aiimin.feature.onboarding.OnboardingRoute
import dagger.hilt.android.AndroidEntryPoint
import javax.inject.Inject

@AndroidEntryPoint
class MainActivity : ComponentActivity() {

    @Inject lateinit var config: ConfigStore
    @Inject lateinit var onboarding: OnboardingStore

    override fun onCreate(savedInstanceState: Bundle?) {
        enableEdgeToEdge()
        super.onCreate(savedInstanceState)
        setContent {
            val prefs by config.state.collectAsStateWithLifecycle()
            val cal by onboarding.state.collectAsStateWithLifecycle()
            AiiminTheme(
                darkTheme = prefs.darkTheme,
                reduceMotion = prefs.reduceMotion,
            ) {
                if (!cal.completed) {
                    OnboardingRoute(onEntered = { /* store already flipped completed */ })
                } else {
                    AiiminShell()
                }
            }
        }
    }
}
