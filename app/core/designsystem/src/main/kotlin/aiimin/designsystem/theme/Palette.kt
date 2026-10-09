package aiimin.designsystem.theme

import androidx.compose.runtime.Immutable
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.graphics.Color

/**
 * Warm Obsidian (dark) and Warm Paper (light), from the inspiration benchmark.
 * Depth comes from five surface layers, not from borders on a flat plane.
 * Accent and "done" are the locked brand colours (DESIGN.md); everything else
 * is neutral, so colour always means something.
 */
@Immutable
data class Palette(
    val isDark: Boolean,
    /** L0 — the canvas behind everything. */
    val base: Color,
    /** L1 — cards. */
    val surface: Color,
    /** L2 — raised rows, inputs, chips. */
    val raised: Color,
    /** L3 — sheets and dialogs. */
    val sheet: Color,
    /** L4 — popovers, pressed states. */
    val overlay: Color,
    val border: Color,
    val borderStrong: Color,
    val text: Color,
    val textMuted: Color,
    val textFaint: Color,
    val accent: Color,
    val onAccent: Color,
    val accentSoft: Color,
    val done: Color,
    val doneSoft: Color,
    val warn: Color,
    val warnSoft: Color,
    val danger: Color,
    val dangerSoft: Color,
    /** Notes, journal, the assistant's "thinking" — the one secondary hue. */
    val violet: Color,
    val violetSoft: Color,
    val scrim: Color,
    /** Domain hues for rings and bars: body, craft, mind, money, people, discipline. */
    val domains: List<Color>,
)

val DarkPalette = Palette(
    isDark = true,
    base = Color(0xFF0A0A0B),
    surface = Color(0xFF141416),
    raised = Color(0xFF1C1C1F),
    sheet = Color(0xFF1A1A1D),
    overlay = Color(0xFF2C2C30),
    border = Color(0xFF26262A),
    borderStrong = Color(0xFF38383D),
    text = Color(0xFFEDEDEF),
    textMuted = Color(0xFFA1A1A8),
    textFaint = Color(0xFF6B6B72),
    accent = Color(0xFFFF6B35),
    onAccent = Color(0xFF1A0D06),
    accentSoft = Color(0x26FF6B35),
    done = Color(0xFF10B981),
    doneSoft = Color(0x2410B981),
    warn = Color(0xFFF2B33D),
    warnSoft = Color(0x24F2B33D),
    danger = Color(0xFFF2555A),
    dangerSoft = Color(0x24F2555A),
    violet = Color(0xFFA78BFA),
    violetSoft = Color(0x24A78BFA),
    scrim = Color(0x99000000),
    domains = listOf(
        Color(0xFF10B981), // body
        Color(0xFFFF6B35), // craft
        Color(0xFFA78BFA), // mind
        Color(0xFFF2B33D), // money
        Color(0xFF6FA8DC), // people
        Color(0xFFE4E4E7), // discipline
    ),
)

val LightPalette = Palette(
    isDark = false,
    base = Color(0xFFF8F7F4),
    surface = Color(0xFFFFFFFF),
    raised = Color(0xFFF2F0EC),
    sheet = Color(0xFFFFFFFF),
    overlay = Color(0xFFEAE7E1),
    border = Color(0xFFE8E6E1),
    borderStrong = Color(0xFFD6D3CC),
    text = Color(0xFF1A1A1A),
    textMuted = Color(0xFF6B6B6B),
    textFaint = Color(0xFF9C9A95),
    accent = Color(0xFFE85D2A),
    onAccent = Color(0xFFFFFFFF),
    accentSoft = Color(0x1FE85D2A),
    done = Color(0xFF0E9F6E),
    doneSoft = Color(0x1F10B981),
    warn = Color(0xFFC98A12),
    warnSoft = Color(0x1FC98A12),
    danger = Color(0xFFD63E44),
    dangerSoft = Color(0x1AD63E44),
    violet = Color(0xFF7C5CD6),
    violetSoft = Color(0x1A7C5CD6),
    scrim = Color(0x66000000),
    domains = listOf(
        Color(0xFF0E9F6E),
        Color(0xFFE85D2A),
        Color(0xFF7C5CD6),
        Color(0xFFC98A12),
        Color(0xFF3F7CB8),
        Color(0xFF3A3A3A),
    ),
)

val LocalPalette = staticCompositionLocalOf { DarkPalette }

/** Avatar hues for people — muted, distinct, never the accent. */
val PersonHues = listOf(
    Color(0xFFD9A47F), Color(0xFF8FB4D9), Color(0xFFB7A3E0), Color(0xFF8CC7A8),
    Color(0xFFE0B86B), Color(0xFFD98F9B), Color(0xFF9DB0B8), Color(0xFFC5B48F),
)
