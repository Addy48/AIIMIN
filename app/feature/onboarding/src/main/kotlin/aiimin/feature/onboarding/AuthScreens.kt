package aiimin.feature.onboarding

import aiimin.core.data.sync.AuthRepository
import aiimin.core.data.sync.AuthResult
import aiimin.core.model.OsIdRules
import aiimin.designsystem.component.AppButton
import aiimin.designsystem.component.AppIconButton
import aiimin.designsystem.component.AppTextField
import aiimin.designsystem.component.ButtonKind
import aiimin.designsystem.component.PinInput
import aiimin.designsystem.icon.AppIcons
import aiimin.designsystem.theme.Aiimin
import android.content.Intent
import android.net.Uri
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.imePadding
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
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
import androidx.compose.ui.focus.FocusRequester
import androidx.compose.ui.focus.focusRequester
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardCapitalization
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

enum class AuthMode { SIGN_IN, SIGN_UP, VERIFY, FORGOT, FORGOT_SENT }

/**
 * AU1 / AU2 for the real aiimin.in backend, which signs people in with an OS-ID (or email) and a
 * 6-digit PIN, and verifies new accounts with an emailed link. Used by onboarding and by Me → Account.
 */
@Composable
fun AuthFlow(
    auth: AuthRepository,
    startAt: AuthMode,
    onBack: () -> Unit,
    onSignedIn: () -> Unit,
    prefillName: String = "",
    modifier: Modifier = Modifier,
) {
    val c = Aiimin.colors
    val scope = rememberCoroutineScope()
    var mode by remember { mutableStateOf(startAt) }
    var id by remember { mutableStateOf("") }
    var pin by remember { mutableStateOf("") }
    var name by remember { mutableStateOf(prefillName) }
    var email by remember { mutableStateOf("") }
    var osId by remember { mutableStateOf("") }
    var pin2 by remember { mutableStateOf("") }
    var busy by remember { mutableStateOf(false) }
    var error by remember { mutableStateOf<String?>(null) }
    var info by remember { mutableStateOf<String?>(null) }
    var cooldown by remember { mutableStateOf(0) }
    var osCheck by remember { mutableStateOf<String?>(null) }
    var osOk by remember { mutableStateOf<Boolean?>(null) }
    val context = LocalContext.current

    LaunchedEffect(cooldown) { if (cooldown > 0) { delay(1000); cooldown-- } }
    // Live OS-ID availability, after a short pause so every keystroke isn't a request.
    LaunchedEffect(osId, mode) {
        osCheck = null; osOk = null
        if (mode != AuthMode.SIGN_UP || osId.isBlank()) return@LaunchedEffect
        val issues = OsIdRules.issues(osId)
        if (issues.isNotEmpty()) { if (osId.length >= 8) { osCheck = issues.first(); osOk = false }; return@LaunchedEffect }
        delay(350)
        val r = auth.osIdAvailable(osId)
        osOk = r.available
        osCheck = when (r.available) { true -> "${OsIdRules.normalize(osId)} is free"; false -> r.message ?: "That OS-ID is taken"; null -> null }
    }

    fun handle(r: AuthResult, onOk: () -> Unit) {
        busy = false
        when (r) {
            is AuthResult.Ok -> onOk()
            is AuthResult.NeedsVerification -> { info = null; error = null; mode = AuthMode.VERIFY; cooldown = 45 }
            is AuthResult.Failed -> error = r.message
        }
    }

    Column(modifier.fillMaxSize().background(c.base).statusBarsPadding().navigationBarsPadding().imePadding()) {
        Row(Modifier.fillMaxWidth().padding(horizontal = 8.dp, vertical = 8.dp), verticalAlignment = Alignment.CenterVertically) {
            AppIconButton(AppIcons.ArrowLeft, "Back", {
                when (mode) {
                    AuthMode.FORGOT, AuthMode.FORGOT_SENT -> { mode = AuthMode.SIGN_IN; error = null; info = null }
                    AuthMode.VERIFY -> { mode = AuthMode.SIGN_UP; error = null }
                    else -> onBack()
                }
            })
        }
        Column(Modifier.weight(1f).verticalScroll(rememberScrollState()).padding(horizontal = 24.dp)) {
            when (mode) {
                AuthMode.SIGN_IN -> {
                    Text("Sign in to aiimin.in", style = Aiimin.type.title.copy(fontSize = 28.sp, lineHeight = 34.sp))
                    Text("Use the OS-ID or email and the 6-digit PIN you use on the website.", style = Aiimin.type.body.copy(color = c.textMuted), modifier = Modifier.padding(top = 8.dp, bottom = 24.dp))
                    // Like aiimin.in: an OS-ID is always capitals, whatever the keyboard sends; an email stays as typed.
                    AppTextField(
                        id, { id = osIdOrEmail(it); error = null }, label = "OS-ID or email", placeholder = "AADI2004 or you@mail.com",
                        capitalization = if ('@' in id) KeyboardCapitalization.None else KeyboardCapitalization.Characters,
                    )
                    Spacer(Modifier.height(16.dp))
                    Text("PIN", style = Aiimin.type.label.copy(color = c.textMuted), modifier = Modifier.padding(bottom = 8.dp))
                    PinInput(pin, { pin = it; error = null }, autoFocus = false)
                    ErrorLine(error)
                    Spacer(Modifier.height(8.dp))
                    Text("Forgot your PIN?", style = Aiimin.type.label.copy(color = c.accentText), modifier = Modifier.clickable { mode = AuthMode.FORGOT; error = null }.padding(vertical = 10.dp))
                }
                AuthMode.SIGN_UP -> {
                    Text("Create your aiimin.in account", style = Aiimin.type.title.copy(fontSize = 28.sp, lineHeight = 34.sp))
                    Text("One account for the app and the website. Your OS-ID is your handle; your PIN unlocks it.", style = Aiimin.type.body.copy(color = c.textMuted), modifier = Modifier.padding(top = 8.dp, bottom = 24.dp))
                    AppTextField(name, { name = it }, label = "First name")
                    Spacer(Modifier.height(12.dp))
                    AppTextField(email, { email = it.trim(); error = null }, label = "Email", keyboardType = KeyboardType.Email, placeholder = "you@mail.com")
                    Spacer(Modifier.height(12.dp))
                    AppTextField(osId, { osId = it.uppercase().filter { ch -> ch.isLetterOrDigit() }.take(8); error = null }, label = "OS-ID · 8 characters, up to 4 numbers", placeholder = "AADI2004", capitalization = KeyboardCapitalization.Characters)
                    if (osCheck != null) Text(osCheck!!, style = Aiimin.type.caption.copy(color = if (osOk == true) c.done else c.warn), modifier = Modifier.padding(top = 6.dp))
                    Spacer(Modifier.height(16.dp))
                    Text("Choose a 6-digit PIN", style = Aiimin.type.label.copy(color = c.textMuted), modifier = Modifier.padding(bottom = 8.dp))
                    PinInput(pin, { pin = it; error = null }, autoFocus = false)
                    Spacer(Modifier.height(12.dp))
                    Text("Repeat the PIN", style = Aiimin.type.label.copy(color = c.textMuted), modifier = Modifier.padding(bottom = 8.dp))
                    PinInput(pin2, { pin2 = it; error = null }, autoFocus = false)
                    if (pin2.length == 6 && pin2 != pin) ErrorLine("The two PINs don't match")
                    ErrorLine(error)
                }
                AuthMode.VERIFY -> {
                    Text("Check your email", style = Aiimin.type.title.copy(fontSize = 28.sp, lineHeight = 34.sp))
                    Text("We sent a link to $email. Tap it, then come back and sign in. The link works once.", style = Aiimin.type.body.copy(color = c.textMuted), modifier = Modifier.padding(top = 8.dp, bottom = 24.dp))
                    Text(
                        if (cooldown > 0) "Resend in 0:${"%02d".format(cooldown)}" else "Send the link again",
                        style = Aiimin.type.label.copy(color = if (cooldown > 0) c.textFaint else c.accentText),
                        modifier = Modifier.clickable(enabled = cooldown == 0 && !busy) {
                            busy = true
                            scope.launch { auth.resendVerification(email).let { r -> busy = false; if (r is AuthResult.Ok) { info = "Sent. Check your inbox and spam."; cooldown = 45 } else if (r is AuthResult.Failed) error = r.message } }
                        }.padding(vertical = 10.dp),
                    )
                    info?.let { Text(it, style = Aiimin.type.caption.copy(color = c.done)) }
                    ErrorLine(error)
                }
                AuthMode.FORGOT -> {
                    Text("Reset your PIN", style = Aiimin.type.title.copy(fontSize = 28.sp, lineHeight = 34.sp))
                    Text("Enter the email on your account. We'll send a link to set a new PIN.", style = Aiimin.type.body.copy(color = c.textMuted), modifier = Modifier.padding(top = 8.dp, bottom = 24.dp))
                    AppTextField(email, { email = it.trim(); error = null }, label = "Email", keyboardType = KeyboardType.Email)
                    ErrorLine(error)
                }
                AuthMode.FORGOT_SENT -> {
                    Text("Check your email", style = Aiimin.type.title.copy(fontSize = 28.sp, lineHeight = 34.sp))
                    Text("If $email has an account, a reset link is on its way. Set a new PIN there, then sign in here.", style = Aiimin.type.body.copy(color = c.textMuted), modifier = Modifier.padding(top = 8.dp))
                }
            }
            Spacer(Modifier.height(24.dp))
        }
        Column(Modifier.fillMaxWidth().padding(horizontal = 24.dp, vertical = 16.dp), horizontalAlignment = Alignment.CenterHorizontally) {
            when (mode) {
                AuthMode.SIGN_IN -> {
                    AppButton(if (busy) "Signing in…" else "Sign in", {
                        busy = true; error = null
                        scope.launch { handle(auth.signIn(id, pin), onSignedIn) }
                    }, Modifier.fillMaxWidth(), enabled = !busy && id.isNotBlank() && pin.length == 6)
                    Spacer(Modifier.height(12.dp))
                    Row(Modifier.clickable { mode = AuthMode.SIGN_UP; error = null }.padding(8.dp)) {
                        Text("New here? ", style = Aiimin.type.body.copy(color = c.textMuted))
                        Text("Create an account", style = Aiimin.type.body.copy(color = c.accentText, fontWeight = FontWeight.SemiBold))
                    }
                }
                AuthMode.SIGN_UP -> {
                    val ready = name.isNotBlank() && email.contains("@") && osOk == true && pin.length == 6 && pin == pin2
                    AppButton(if (busy) "Creating…" else "Create account", {
                        busy = true; error = null
                        scope.launch { handle(auth.signUp(name, email, osId, pin), {}) }
                    }, Modifier.fillMaxWidth(), enabled = !busy && ready)
                    Spacer(Modifier.height(12.dp))
                    Row(Modifier.clickable { mode = AuthMode.SIGN_IN; error = null }.padding(8.dp)) {
                        Text("Already have one? ", style = Aiimin.type.body.copy(color = c.textMuted))
                        Text("Sign in", style = Aiimin.type.body.copy(color = c.accentText, fontWeight = FontWeight.SemiBold))
                    }
                }
                AuthMode.VERIFY -> {
                    AppButton(if (busy) "Signing in…" else "I've verified · Sign in", {
                        busy = true; error = null
                        scope.launch { handle(auth.signIn(osId.ifBlank { email }, pin), onSignedIn) }
                    }, Modifier.fillMaxWidth(), enabled = !busy && pin.length == 6)
                }
                AuthMode.FORGOT -> AppButton(if (busy) "Sending…" else "Send the link", {
                    busy = true; error = null
                    scope.launch { auth.forgotPin(email).let { r -> busy = false; if (r is AuthResult.Ok) mode = AuthMode.FORGOT_SENT else if (r is AuthResult.Failed) error = r.message } }
                }, Modifier.fillMaxWidth(), enabled = !busy && email.contains("@"))
                AuthMode.FORGOT_SENT -> AppButton("Back to sign in", { mode = AuthMode.SIGN_IN }, Modifier.fillMaxWidth(), kind = ButtonKind.SECONDARY)
            }
            Spacer(Modifier.height(10.dp))
            Row(horizontalArrangement = Arrangement.Center, modifier = Modifier.fillMaxWidth()) {
                Text("By continuing you agree to the ", style = Aiimin.type.caption)
                Text("Terms", style = Aiimin.type.caption.copy(color = c.accentText), modifier = Modifier.clickable { context.startActivity(Intent(Intent.ACTION_VIEW, Uri.parse("https://www.aiimin.in/terms"))) })
                Text(" and ", style = Aiimin.type.caption)
                Text("Privacy Policy", style = Aiimin.type.caption.copy(color = c.accentText), modifier = Modifier.clickable { context.startActivity(Intent(Intent.ACTION_VIEW, Uri.parse("https://www.aiimin.in/privacy"))) })
            }
        }
    }
}

@Composable
private fun ErrorLine(text: String?) {
    if (text != null) Text(text, style = Aiimin.type.caption.copy(color = Aiimin.colors.warn, fontSize = 13.sp), modifier = Modifier.padding(top = 8.dp))
}

/** Sign-in field: no "@" means an OS-ID, shown and sent in capitals (as aiimin.in does); with "@" it is an email, left as typed. */
internal fun osIdOrEmail(raw: String): String = if ('@' in raw) raw.trim() else raw.uppercase().filter { !it.isWhitespace() }
