package `in`.aiimin.app.ui.auth

import android.content.Intent
import android.net.Uri
import androidx.browser.customtabs.CustomTabsIntent
import androidx.compose.animation.AnimatedContent
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.tween
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.slideInHorizontally
import androidx.compose.animation.slideOutHorizontally
import androidx.compose.animation.togetherWith
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.input.KeyboardCapitalization
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import `in`.aiimin.app.AppContainer
import `in`.aiimin.app.R
import `in`.aiimin.app.ui.brand.AiiminLogoLockup
import `in`.aiimin.app.ui.components.AiiminCard
import `in`.aiimin.app.ui.components.AiiminPrimaryButton
import `in`.aiimin.app.ui.components.AiiminTextButton
import `in`.aiimin.app.ui.theme.Accent
import `in`.aiimin.app.ui.theme.FamiljenGrotesk
import `in`.aiimin.app.ui.theme.Figtree
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

private val Ivory = Color(0xFFEDE4D3)
private val Charcoal = Color(0xFF14171A)
private val Muted = Color(0xFF6B7280)
private val SurfaceWhite = Color(0xFFFFFFFF)
private val Border = Color(0xFFD1D5DB)

private enum class AuthSurface { Welcome, Form }
private enum class AuthMode { Login, Signup, Forgot }
private enum class LoginStep { Identity, Pin }
private enum class SignupStep { Info, OsId, Pin, Confirm, Tier, LifeArc }

private fun signupProgressStep(step: SignupStep): Int = when (step) {
    SignupStep.Info, SignupStep.OsId -> 1
    SignupStep.Pin, SignupStep.Confirm -> 2
    SignupStep.Tier -> 3
    SignupStep.LifeArc -> 4
}

@Composable
fun AuthScreen(container: AppContainer) {
    var surface by remember { mutableStateOf(AuthSurface.Welcome) }
    var mode by remember { mutableStateOf(AuthMode.Login) }
    var loginStep by remember { mutableStateOf(LoginStep.Identity) }
    var signupStep by remember { mutableStateOf(SignupStep.Info) }
    var identifier by remember { mutableStateOf("") }
    var fullName by remember { mutableStateOf("") }
    var email by remember { mutableStateOf("") }
    var osId by remember { mutableStateOf("") }
    var pin by remember { mutableStateOf("") }
    var confirmPin by remember { mutableStateOf("") }
    var selectedTier by remember { mutableStateOf(defaultSignupTier()) }
    var lifeArc by remember { mutableStateOf("") }
    var forgotId by remember { mutableStateOf("") }
    var forgotSent by remember { mutableStateOf(false) }
    var error by remember { mutableStateOf<String?>(null) }
    var loading by remember { mutableStateOf(false) }
    var authInFlight by remember { mutableStateOf(false) }
    var shake by remember { mutableStateOf(false) }
    val scope = rememberCoroutineScope()
    val context = LocalContext.current

    fun triggerShake() {
        shake = true
        scope.launch { delay(450); shake = false }
    }

    fun resetPins() {
        pin = ""
        confirmPin = ""
    }

    fun resetAll() {
        mode = AuthMode.Login
        loginStep = LoginStep.Identity
        signupStep = SignupStep.Info
        resetPins()
        error = null
        forgotSent = false
    }

    fun goWelcome() {
        surface = AuthSurface.Welcome
        resetAll()
    }

    when (surface) {
        AuthSurface.Welcome -> WelcomeGate(
            onSignIn = {
                mode = AuthMode.Login
                loginStep = LoginStep.Identity
                signupStep = SignupStep.Info
                resetPins()
                error = null
                surface = AuthSurface.Form
            },
            onSignUp = {
                mode = AuthMode.Signup
                loginStep = LoginStep.Identity
                signupStep = SignupStep.Info
                resetPins()
                error = null
                surface = AuthSurface.Form
            },
        )
        AuthSurface.Form -> {
            val heroGradient = Brush.verticalGradient(
                0f to Color(0xFFFF7A45),
                0.55f to Accent,
                1f to Color(0xFF9A3412),
            )
            Box(Modifier.fillMaxSize().background(MaterialTheme.colorScheme.background)) {
                Column(Modifier.fillMaxSize()) {
                    Box(
                        Modifier
                            .fillMaxWidth()
                            .height(168.dp)
                            .background(heroGradient)
                            .statusBarsPadding(),
                    ) {
                        Column(Modifier.fillMaxSize().padding(horizontal = 20.dp, vertical = 12.dp)) {
                            AiiminTextButton("← Back", onClick = { goWelcome() })
                            Spacer(Modifier.height(8.dp))
                            AiiminLogoLockup(
                                markSize = 36.dp,
                                subtitle = "Human Momentum",
                                horizontal = true,
                            )
                        }
                    }
                    Surface(
                        modifier = Modifier
                            .fillMaxWidth()
                            .weight(1f)
                            .graphicsLayer { translationY = -20f },
                        shape = RoundedCornerShape(topStart = 28.dp, topEnd = 28.dp),
                        color = MaterialTheme.colorScheme.surface,
                        shadowElevation = 16.dp,
                    ) {
                        Column(
                            Modifier
                                .fillMaxSize()
                                .verticalScroll(rememberScrollState())
                                .padding(horizontal = 24.dp, vertical = 24.dp)
                                .navigationBarsPadding(),
                        ) {
                            AuthHeading(mode, loginStep, signupStep, identifier, forgotSent)

                            if (mode == AuthMode.Signup) {
                                Spacer(Modifier.height(16.dp))
                                AuthStepDots(
                                    current = signupProgressStep(signupStep),
                                    total = 4,
                                )
                            }

                            Spacer(Modifier.height(20.dp))

                            AiiminCard(containerColor = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.35f)) {
                                AnimatedContent(
                                    targetState = "${mode.name}-${loginStep.name}-${signupStep.name}-$forgotSent",
                                    transitionSpec = {
                                        (slideInHorizontally { it / 6 } + fadeIn(tween(280))) togetherWith
                                            (slideOutHorizontally { -it / 8 } + fadeOut(tween(200)))
                                    },
                                    label = "auth-form",
                                ) { _ ->
                                    when (mode) {
                                        AuthMode.Forgot -> if (forgotSent) {
                                            ForgotDoneStep(forgotId) { resetAll() }
                                        } else {
                                            ForgotForm(
                                                value = forgotId,
                                                onValue = { forgotId = it; error = null },
                                                loading = loading,
                                                error = error,
                                                onBack = { mode = AuthMode.Login; error = null },
                                                onSubmit = {
                                                    scope.launch {
                                                        loading = true
                                                        error = null
                                                        val r = container.repository.requestPasswordReset(forgotId)
                                                        loading = false
                                                        r.onSuccess { forgotSent = true }
                                                            .onFailure { error = it.message; triggerShake() }
                                                    }
                                                },
                                            )
                                        }
                                        AuthMode.Login -> when (loginStep) {
                                            LoginStep.Identity -> LoginIdentityForm(
                                                identifier = identifier,
                                                onIdentifier = {
                                                    identifier = if (OsIdRules.isEmailIdentifier(it) || (it.contains('@') && it.length > 8)) {
                                                        it
                                                    } else OsIdRules.normalizeLoginIdentifier(it)
                                                    error = null
                                                },
                                                loading = loading,
                                                onContinue = {
                                                    scope.launch {
                                                        loading = true
                                                        error = null
                                                        val id = identifier.trim()
                                                        val ok = when {
                                                            OsIdRules.isEmailIdentifier(id) -> {
                                                                val valid = Regex("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$").matches(id)
                                                                if (!valid) error = "Enter a valid email."
                                                                valid
                                                            }
                                                            OsIdRules.isCompleteOsId(id) ->
                                                                container.repository.resolveIdentifier(id).fold(
                                                                    onSuccess = { resolved ->
                                                                        if (resolved == null) {
                                                                            error = "OS-ID not found on the network."
                                                                            false
                                                                        } else true
                                                                    },
                                                                    onFailure = {
                                                                        error = it.message ?: "OS-ID not found"
                                                                        false
                                                                    },
                                                                )
                                                            else -> {
                                                                error = "Enter your full 8-character OS-ID or email."
                                                                false
                                                            }
                                                        }
                                                        loading = false
                                                        if (ok) { resetPins(); loginStep = LoginStep.Pin } else triggerShake()
                                                    }
                                                },
                                            )
                                            LoginStep.Pin -> PinStepView(
                                                pin = pin,
                                                shake = shake,
                                                loading = loading,
                                                onDigit = { if (pin.length < 6) { pin += it; error = null } },
                                                onDelete = { if (pin.isNotEmpty()) pin = pin.dropLast(1) },
                                                onClear = { pin = "" },
                                                onBack = { loginStep = LoginStep.Identity; resetPins(); error = null },
                                                onForgot = { mode = AuthMode.Forgot; forgotId = identifier; error = null },
                                            )
                                        }
                                        AuthMode.Signup -> when (signupStep) {
                                            SignupStep.Info -> SignupInfoForm(
                                                fullName, email,
                                                onName = { fullName = it; error = null },
                                                onEmail = { email = it; error = null },
                                                loading = loading,
                                                onContinue = {
                                                    when {
                                                        fullName.isBlank() -> { error = "Name required."; triggerShake() }
                                                        email.isNotBlank() && !Regex("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$").matches(email.trim()) -> {
                                                            error = "Enter a valid email."; triggerShake()
                                                        }
                                                        else -> { signupStep = SignupStep.OsId; error = null }
                                                    }
                                                },
                                            )
                                            SignupStep.OsId -> SignupOsIdForm(
                                                osId = osId,
                                                onOsId = { osId = OsIdRules.normalizeOsId(it); error = null },
                                                loading = loading,
                                                onBack = { signupStep = SignupStep.Info },
                                                onContinue = {
                                                    OsIdRules.validateOsId(osId)?.let { error = it; triggerShake(); return@SignupOsIdForm }
                                                    scope.launch {
                                                        loading = true
                                                        val r = container.repository.resolveIdentifier(osId)
                                                        loading = false
                                                        if (r.isSuccess && !r.getOrNull().isNullOrBlank()) {
                                                            error = "This OS-ID is already taken."
                                                            triggerShake()
                                                        } else {
                                                            resetPins()
                                                            signupStep = SignupStep.Pin
                                                            error = null
                                                        }
                                                    }
                                                },
                                            )
                                            SignupStep.Pin -> PinStepView(
                                                pin = pin,
                                                shake = shake,
                                                loading = loading,
                                                onDigit = { if (pin.length < 6) { pin += it; error = null } },
                                                onDelete = { if (pin.isNotEmpty()) pin = pin.dropLast(1) },
                                                onClear = { pin = "" },
                                                onBack = { signupStep = SignupStep.OsId; resetPins() },
                                            )
                                            SignupStep.Confirm -> PinStepView(
                                                pin = confirmPin,
                                                shake = shake,
                                                loading = loading,
                                                onDigit = { if (confirmPin.length < 6) { confirmPin += it; error = null } },
                                                onDelete = { if (confirmPin.isNotEmpty()) confirmPin = confirmPin.dropLast(1) },
                                                onClear = { confirmPin = "" },
                                                onBack = { signupStep = SignupStep.Pin; confirmPin = "" },
                                            )
                                            SignupStep.Tier -> SignupTierForm(
                                                selected = selectedTier,
                                                onSelect = { selectedTier = it },
                                                onBack = { signupStep = SignupStep.Confirm },
                                                onContinue = { signupStep = SignupStep.LifeArc; error = null },
                                            )
                                            SignupStep.LifeArc -> SignupLifeArcForm(
                                                value = lifeArc,
                                                onValue = { lifeArc = it; error = null },
                                                loading = loading,
                                                onBack = { signupStep = SignupStep.Tier },
                                                onSkip = {
                                                    scope.launch {
                                                        loading = true
                                                        authInFlight = true
                                                        container.repository.signUpWithOsId(osId, pin, fullName, email)
                                                            .onFailure { err ->
                                                                error = err.message ?: "Sign-up failed"
                                                                triggerShake()
                                                            }
                                                            .onSuccess {
                                                                container.appPrefs.saveSignupAwareness(selectedTier, "")
                                                            }
                                                        loading = false
                                                        authInFlight = false
                                                    }
                                                },
                                                onContinue = {
                                                    scope.launch {
                                                        loading = true
                                                        authInFlight = true
                                                        container.repository.signUpWithOsId(osId, pin, fullName, email)
                                                            .onFailure { err ->
                                                                error = err.message ?: "Sign-up failed"
                                                                triggerShake()
                                                            }
                                                            .onSuccess {
                                                                container.appPrefs.saveSignupAwareness(selectedTier, lifeArc.trim())
                                                            }
                                                        loading = false
                                                        authInFlight = false
                                                    }
                                                },
                                            )
                                        }
                                    }
                                }
                            }

                            error?.let {
                                Spacer(Modifier.height(12.dp))
                                Text(
                                    it,
                                    color = MaterialTheme.colorScheme.error,
                                    fontSize = 13.sp,
                                    textAlign = TextAlign.Center,
                                    modifier = Modifier.fillMaxWidth(),
                                    fontFamily = Figtree,
                                )
                            }

                            if (mode != AuthMode.Forgot) {
                                Spacer(Modifier.height(20.dp))
                                AuthModeToggle(
                                    isLogin = mode == AuthMode.Login,
                                    onToggle = {
                                        mode = if (mode == AuthMode.Login) AuthMode.Signup else AuthMode.Login
                                        loginStep = LoginStep.Identity
                                        signupStep = SignupStep.Info
                                        resetPins()
                                        error = null
                                    },
                                )
                            }
                            Spacer(Modifier.height(16.dp))
                        }
                    }
                }
            }
        }
    }

    LaunchedEffect(surface, pin, confirmPin, mode, loginStep, signupStep) {
        if (surface != AuthSurface.Form || authInFlight) return@LaunchedEffect
        if (mode == AuthMode.Login && loginStep == LoginStep.Pin && pin.length == 6) {
            authInFlight = true
            loading = true
            error = null
            container.repository.signInWithOsIdOrEmail(identifier, pin)
                .onFailure { err ->
                    error = err.message ?: "Sign-in failed"
                    triggerShake()
                    pin = ""
                }
            loading = false
            authInFlight = false
        } else if (mode == AuthMode.Signup && signupStep == SignupStep.Pin && pin.length == 6 && !authInFlight) {
            signupStep = SignupStep.Confirm
        } else if (mode == AuthMode.Signup && signupStep == SignupStep.Confirm && confirmPin.length == 6) {
            if (confirmPin != pin) {
                error = "PINs do not match."
                triggerShake()
                confirmPin = ""
            } else {
                signupStep = SignupStep.Tier
                error = null
            }
        }
    }
}

@Composable
private fun AuthHeading(mode: AuthMode, loginStep: LoginStep, signupStep: SignupStep, identifier: String, forgotSent: Boolean) {
    val (title, sub) = when (mode) {
        AuthMode.Forgot -> if (forgotSent) "Check your inbox" to "A recovery link has been sent."
        else "Reset access" to "We'll send a recovery link to your email."
        AuthMode.Login -> when (loginStep) {
            LoginStep.Identity -> "Welcome back" to "Sign in to your Life OS"
            LoginStep.Pin -> "Enter your PIN" to "6-digit PIN for ${OsIdRules.maskIdentity(identifier)}"
        }
        AuthMode.Signup -> when (signupStep) {
            SignupStep.Info -> "Create account" to "Join AIIMIN — journal, habits, and focus in sync."
            SignupStep.OsId -> "Choose an OS-ID" to "Your unique handle across the network."
            SignupStep.Pin -> "Set a PIN" to "Choose a secure 6-digit access PIN."
            SignupStep.Confirm -> "Confirm your PIN" to "Re-enter your PIN to confirm."
            SignupStep.Tier -> "Choose your tier" to "Awareness only — manage billing on aiimin.in."
            SignupStep.LifeArc -> "Life Arc" to "Optional — where is your story headed?"
        }
    }
    Column {
        Text(title, fontFamily = FamiljenGrotesk, fontWeight = FontWeight.ExtraBold, fontSize = 26.sp, color = MaterialTheme.colorScheme.onSurface, letterSpacing = (-0.5).sp)
        Spacer(Modifier.height(6.dp))
        Text(sub, fontFamily = Figtree, fontWeight = FontWeight.SemiBold, fontSize = 14.sp, color = MaterialTheme.colorScheme.onSurfaceVariant, lineHeight = 20.sp)
    }
}

@Composable
private fun AuthModeToggle(isLogin: Boolean, onToggle: () -> Unit) {
    Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.Center, verticalAlignment = Alignment.CenterVertically) {
        Text(
            if (isLogin) "Don't have an account?" else "Already have an account?",
            fontSize = 14.sp,
            color = MaterialTheme.colorScheme.onSurface,
            fontFamily = Figtree,
        )
        Spacer(Modifier.size(8.dp))
        Text(
            if (isLogin) "Sign up" else "Sign in",
            modifier = Modifier
                .clip(RoundedCornerShape(12.dp))
                .background(Accent.copy(0.12f))
                .border(1.5.dp, Accent, RoundedCornerShape(12.dp))
                .clickable(onClick = onToggle)
                .padding(horizontal = 16.dp, vertical = 10.dp),
            color = Accent,
            fontWeight = FontWeight.Bold,
            fontSize = 14.sp,
            fontFamily = Figtree,
        )
    }
}

@Composable
private fun PrimaryButton(label: String, enabled: Boolean, loading: Boolean, onClick: () -> Unit) {
    AiiminPrimaryButton(
        text = label,
        onClick = onClick,
        enabled = enabled,
        loading = loading,
    )
}

@Composable
private fun AuthField(
    label: String,
    value: String,
    onValue: (String) -> Unit,
    placeholder: String,
    capitalization: KeyboardCapitalization = KeyboardCapitalization.None,
    imeAction: ImeAction = ImeAction.Done,
    onIme: () -> Unit = {},
) {
    Text(label.uppercase(), style = MaterialTheme.typography.labelLarge, color = MaterialTheme.colorScheme.onSurface)
    Spacer(Modifier.height(8.dp))
    OutlinedTextField(
        value = value,
        onValueChange = onValue,
        placeholder = { Text(placeholder, color = Muted) },
        singleLine = true,
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(14.dp),
        colors = OutlinedTextFieldDefaults.colors(
            focusedBorderColor = Accent,
            unfocusedBorderColor = MaterialTheme.colorScheme.outline,
            focusedContainerColor = MaterialTheme.colorScheme.surface,
            unfocusedContainerColor = MaterialTheme.colorScheme.surface,
            focusedTextColor = MaterialTheme.colorScheme.onSurface,
            unfocusedTextColor = MaterialTheme.colorScheme.onSurface,
            cursorColor = Accent,
        ),
        keyboardOptions = KeyboardOptions(capitalization = capitalization, imeAction = imeAction),
        keyboardActions = KeyboardActions(onDone = { onIme() }, onNext = { onIme() }),
    )
}

@Composable
private fun LoginIdentityForm(identifier: String, onIdentifier: (String) -> Unit, loading: Boolean, onContinue: () -> Unit) {
    Column(verticalArrangement = Arrangement.spacedBy(16.dp)) {
        AuthField("OS-ID / Email", identifier, onIdentifier, "8-char OS-ID or email", KeyboardCapitalization.Characters, ImeAction.Go, onContinue)
        PrimaryButton("Continue", enabled = true, loading = loading, onClick = onContinue)
    }
}

@Composable
private fun SignupInfoForm(fullName: String, email: String, onName: (String) -> Unit, onEmail: (String) -> Unit, loading: Boolean, onContinue: () -> Unit) {
    Column(verticalArrangement = Arrangement.spacedBy(16.dp)) {
        AuthField("Your name", fullName, onName, "Full name", imeAction = ImeAction.Next)
        AuthField("Email (optional)", email, onEmail, "you@email.com", imeAction = ImeAction.Done, onIme = onContinue)
        PrimaryButton("Continue", enabled = true, loading = loading, onClick = onContinue)
    }
}

@Composable
private fun SignupOsIdForm(osId: String, onOsId: (String) -> Unit, loading: Boolean, onBack: () -> Unit, onContinue: () -> Unit) {
    val digits = osId.count { it.isDigit() }
    Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
        Text("← Back", color = Muted, modifier = Modifier.clickable(onClick = onBack), fontFamily = Figtree, fontWeight = FontWeight.SemiBold)
        AuthField("Create OS-ID", osId, onOsId, "Exactly 8 characters", KeyboardCapitalization.Characters)
        RuleLine(osId.length == 8, "Exactly 8 characters (${osId.length}/8)")
        RuleLine(digits <= 4, "Max 4 numbers ($digits/4)")
        RuleLine(osId.isNotEmpty() && Regex("^[A-Z0-9@,._\\-=+*^$#!]*$").matches(osId), "Symbols @,._-=+*^\$#! allowed")
        PrimaryButton("Continue", enabled = true, loading = loading, onClick = onContinue)
    }
}

@Composable
private fun RuleLine(ok: Boolean, label: String) {
    Text(if (ok) "✓  $label" else "○  $label", fontSize = 12.sp, color = if (ok) Color(0xFF059669) else Muted, fontFamily = Figtree)
}

@Composable
private fun PinStepView(
    pin: String,
    shake: Boolean,
    loading: Boolean,
    onDigit: (Char) -> Unit,
    onDelete: () -> Unit,
    onClear: () -> Unit,
    onBack: () -> Unit,
    onForgot: (() -> Unit)? = null,
) {
    Column(horizontalAlignment = Alignment.CenterHorizontally, verticalArrangement = Arrangement.spacedBy(14.dp)) {
        Text("← Back", color = Muted, modifier = Modifier.align(Alignment.Start).clickable(onClick = onBack), fontFamily = Figtree, fontWeight = FontWeight.SemiBold)
        PinDots(value = pin, shake = shake)
        if (loading) {
            CircularProgressIndicator(color = Accent, strokeWidth = 2.dp, modifier = Modifier.size(28.dp))
        } else {
            PinNumpad(onDigit = onDigit, onDelete = onDelete, onClear = onClear)
        }
        onForgot?.let {
            Text("Forgot PIN?", color = Accent, fontWeight = FontWeight.Bold, fontSize = 14.sp, modifier = Modifier.clickable(onClick = it), fontFamily = Figtree)
        }
    }
}

@Composable
private fun ForgotForm(value: String, onValue: (String) -> Unit, loading: Boolean, error: String?, onBack: () -> Unit, onSubmit: () -> Unit) {
    Column(verticalArrangement = Arrangement.spacedBy(16.dp)) {
        Text("← Back to sign in", color = Muted, modifier = Modifier.clickable(onClick = onBack), fontFamily = Figtree, fontWeight = FontWeight.SemiBold)
        AuthField("OS-ID / Email", value, onValue, "Enter OS-ID or email", KeyboardCapitalization.Characters, ImeAction.Go, onSubmit)
        PrimaryButton("Send recovery link", enabled = true, loading = loading, onClick = onSubmit)
    }
}

@Composable
private fun ForgotDoneStep(identifier: String, onBack: () -> Unit) {
    Column(verticalArrangement = Arrangement.spacedBy(16.dp)) {
        Box(Modifier.size(56.dp).clip(RoundedCornerShape(99.dp)).background(Accent.copy(0.15f)), contentAlignment = Alignment.Center) {
            Text("✓", fontSize = 28.sp, color = Accent, fontWeight = FontWeight.Bold)
        }
        Text(
            "If an account for $identifier exists, a secure recovery link has been sent.",
            fontSize = 14.sp,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
            lineHeight = 22.sp,
            fontFamily = Figtree,
        )
        Text("← Return to login", color = Accent, fontWeight = FontWeight.Bold, modifier = Modifier.clickable(onClick = onBack), fontFamily = Figtree)
    }
}
