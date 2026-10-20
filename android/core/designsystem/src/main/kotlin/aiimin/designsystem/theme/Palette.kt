package aiimin.designsystem.theme

import androidx.compose.runtime.Immutable
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.graphics.Color

/**
 * The locked visual system (AIIMIN_DESIGN_HANDOFF §1). Evidence beige, warm ink,
 * one orange. `accent` is for fills only (now line, sun, selected bar, badges);
 * orange text on beige uses [accentText] because #FF6B35 text fails contrast.
 * No gradients, no purple. Light theme only (PRD 1.1); [DarkPalette] is dormant code, never offered.
 */
@Immutable
data class Palette(
    val isDark: Boolean,
    /** App background. Fixed: never tinted by time of day. */
    val base: Color,
    /** Now card, review cards, sheets. */
    val surface: Color,
    /** surfaceSunk: search field, info blocks, unselected chips. */
    val raised: Color,
    val sheet: Color,
    /** Popovers, pressed states. */
    val overlay: Color,
    /** Hairline: 1dp row dividers. */
    val border: Color,
    /** Outline: secondary button border, unselected chip border. */
    val borderStrong: Color,
    val text: Color,
    val textMuted: Color,
    val textFaint: Color,
    /** Fills only. */
    val accent: Color,
    /** Orange text: the active tab and at most one accent in a screen's content (PRD 17.1 rule 6). */
    val accentText: Color,
    /** Text links and text actions ("All tasks", "Manage", "Terms"): ink, so they never add orange. */
    val link: Color,
    /** Text/icons placed on an accent fill. */
    val onAccent: Color,
    val accentSoft: Color,
    val done: Color,
    val doneSoft: Color,
    val warn: Color,
    val warnSoft: Color,
    val danger: Color,
    val dangerSoft: Color,
    /** The one secondary hue: a cool slate for info, notes, links (never purple). */
    val violet: Color,
    val violetSoft: Color,
    val scrim: Color,
    val segmentTrack: Color,
    val band: Color,
    val bandScore: Color,
    val bandLine: Color,
    val vialCalm: Color,
    val futureBar: Color,
    val linkChip: Color,
    val linkChipText: Color,
    val justAdded: Color,
    val chartInactive: Color,
    /** Review stack cards peeking behind the front card. */
    val stackMid: Color,
    val stackBack: Color,
    /** Text and icons on an ink (`text`) fill. */
    val onInk: Color,
    /** The action word on an ink toast (undo). */
    val onInkAccent: Color,
    /** A page: document thumbnails, edit cards, segmented thumb. */
    val paper: Color,
    /** The AIIMIN mark: pale arch and inner peak (logo-symbol.svg). */
    val markArch: Color,
    val markInner: Color,
    /** Soft key shadow under raised controls. */
    val shadowKey: Color,
    /** Chart bars when nothing is emphasised, and the dimmed bars. */
    val chartInk: Color,
    val chartDim: Color,
    /** Money spend bars and the spend chart line. */
    val moneyGold: Color,
    /** Muted domain hues for bars and legends (no rings). */
    val domains: List<Color>,
)

val LightPalette = Palette(
    isDark = false,
    base = Color(0xFFF5F3EE),
    surface = Color(0xFFFBFAF7),
    raised = Color(0xFFECE8E0),
    sheet = Color(0xFFFBFAF7),
    overlay = Color(0xFFE3DED4),
    border = Color(0xFFDEDAD2),
    borderStrong = Color(0xFFC9C2B6),
    text = Color(0xFF1A1916),
    textMuted = Color(0xFF625E57),
    textFaint = Color(0xFF8A8478),
    accent = Color(0xFFFF6B35),
    accentText = Color(0xFFC24E20),
    link = Color(0xFF1A1916),
    onAccent = Color(0xFF1A1916),
    accentSoft = Color(0xFFF6E5DA),
    done = Color(0xFF2F6B4F),
    doneSoft = Color(0xFFDDEBE3),
    warn = Color(0xFFA8431A),
    warnSoft = Color(0xFFF2DFD3),
    danger = Color(0xFFB4462A),
    dangerSoft = Color(0xFFF2DFD3),
    violet = Color(0xFF4B5A68),
    violetSoft = Color(0xFFE1E6EB),
    scrim = Color(0x571A1916),
    segmentTrack = Color(0xFFEAE6DE),
    band = Color(0xFFEDE6D8),
    bandScore = Color(0xFFDDE3E9),
    bandLine = Color(0xFFA39A88),
    vialCalm = Color(0xFF9DB2C6),
    futureBar = Color(0xFFE4DFD5),
    linkChip = Color(0xFFF2DFD3),
    linkChipText = Color(0xFF8A3517),
    justAdded = Color(0xFFF6E5DA),
    chartInactive = Color(0xFF5B5750),
    stackMid = Color(0xFFF0ECE5),
    stackBack = Color(0xFFE9E5DD),
    onInk = Color(0xFFFFFFFF),
    onInkAccent = Color(0xFFFFB08A),
    paper = Color(0xFFFFFFFF),
    markArch = Color(0xFFD1D5DB),
    markInner = Color(0xFF6B7280),
    shadowKey = Color(0x33000000),
    chartInk = Color(0xFF8C8273),
    chartDim = Color(0xFFD9D2C5),
    moneyGold = Color(0xFFB8893A),
    domains = listOf(
        Color(0xFF2F6B4F), // body
        Color(0xFFC24E20), // craft
        Color(0xFF4B5A68), // mind
        Color(0xFF8A6D2F), // money
        Color(0xFF6F7C88), // people
        Color(0xFF1A1916), // discipline
    ),
)

val DarkPalette = Palette(
    isDark = true,
    base = Color(0xFF141311),
    surface = Color(0xFF1C1A17),
    raised = Color(0xFF26231F),
    sheet = Color(0xFF1C1A17),
    overlay = Color(0xFF312D28),
    border = Color(0xFF2D2A26),
    borderStrong = Color(0xFF45403A),
    text = Color(0xFFF2EFE8),
    textMuted = Color(0xFFA39D92),
    textFaint = Color(0xFF7A756B),
    accent = Color(0xFFFF7A47),
    accentText = Color(0xFFFF9467),
    link = Color(0xFFF2EFE8),
    onAccent = Color(0xFF1A1916),
    accentSoft = Color(0xFF3A2418),
    done = Color(0xFF7FB89A),
    doneSoft = Color(0xFF1F2E26),
    warn = Color(0xFFE8836A),
    warnSoft = Color(0xFF35211B),
    danger = Color(0xFFEE8A74),
    dangerSoft = Color(0xFF35211B),
    violet = Color(0xFF9DB2C6),
    violetSoft = Color(0xFF202830),
    scrim = Color(0x99000000),
    segmentTrack = Color(0xFF26231F),
    band = Color(0xFF202830),
    bandScore = Color(0xFF202830),
    bandLine = Color(0xFF8A9DB0),
    vialCalm = Color(0xFF6F8397),
    futureBar = Color(0xFF2A2723),
    linkChip = Color(0xFF3A2418),
    linkChipText = Color(0xFFFFB08A),
    justAdded = Color(0xFF3A2418),
    chartInactive = Color(0xFF8A857A),
    stackMid = Color(0xFF201E1B),
    stackBack = Color(0xFF1A1816),
    onInk = Color(0xFF141311),
    onInkAccent = Color(0xFFFFB08A),
    paper = Color(0xFF26231F),
    markArch = Color(0xFFD1D5DB),
    markInner = Color(0xFF6B7280),
    shadowKey = Color(0x33000000),
    chartInk = Color(0xFF8C8273),
    chartDim = Color(0xFF45403A),
    moneyGold = Color(0xFFD9B26A),
    domains = listOf(
        Color(0xFF7FB89A),
        Color(0xFFFF9467),
        Color(0xFF9DB2C6),
        Color(0xFFD9B26A),
        Color(0xFF8A9DB0),
        Color(0xFFF2EFE8),
    ),
)

val LocalPalette = staticCompositionLocalOf { LightPalette }

/** Avatar hues are retired (handoff: avatars are ink squares); kept for old call sites. */
val PersonHues = listOf(
    Color(0xFF1A1916), Color(0xFF1A1916), Color(0xFF1A1916), Color(0xFF1A1916),
    Color(0xFF1A1916), Color(0xFF1A1916), Color(0xFF1A1916), Color(0xFF1A1916),
)

/** Time-of-day tint for the Today horizon only (handoff §1). */
@Immutable
data class Horizon(val sun: Color, val line: Color, val dottedFuture: Color)

object Horizons {
    val morning = Horizon(Color(0xFFFF8A4C), Color(0xFF1A1916), Color(0xFFD9CDBD))
    val midday = Horizon(Color(0xFFFF6B35), Color(0xFF1A1916), Color(0xFFD2CBBE))
    val evening = Horizon(Color(0xFFD8653E), Color(0xFF3A3530), Color(0xFFD0C7BA))
    fun at(hour: Int, dark: Boolean): Horizon {
        val h = when {
            hour < 12 -> morning
            hour < 17 -> midday
            else -> evening
        }
        return if (dark) h.copy(line = Color(0xFFF2EFE8), dottedFuture = Color(0xFF4A4038)) else h
    }
}
