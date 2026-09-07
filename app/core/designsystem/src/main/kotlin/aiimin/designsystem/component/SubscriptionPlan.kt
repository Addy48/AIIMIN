package aiimin.designsystem.component

import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.CubicBezierEasing
import androidx.compose.animation.core.FastOutSlowInEasing
import androidx.compose.animation.core.tween
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.StrokeJoin
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.em
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import androidx.compose.ui.window.DialogProperties
import aiimin.core.model.SubscriptionTier
import aiimin.core.model.TierFeature
import aiimin.core.model.TierIconKind
import aiimin.core.model.TierSoul
import aiimin.core.model.TierSouls
import aiimin.designsystem.theme.AiiminTheme
import aiimin.designsystem.theme.BrandSpark
import aiimin.designsystem.theme.Hairline
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

private val MeetEase = CubicBezierEasing(0.16f, 1f, 0.3f, 1f)
private val DraftEase = CubicBezierEasing(0.22f, 1f, 0.36f, 1f)
private val DraftEaseIn = CubicBezierEasing(0.4f, 0f, 0.2f, 1f)

/** Website Account card radius — soft drafting corners (not sharp 0, not SaaS pills). */
private val PlanCardShape = RoundedCornerShape(10.dp)
private val PlanIconShape = RoundedCornerShape(8.dp)
private val PlanCtaShape = RoundedCornerShape(8.dp)
private val PlanPillShape = RoundedCornerShape(8.dp)

/** Product done / web feature check (`--color-success` twin). */
private val PlanCheck = Color(0xFF10B981)

fun TierSoul.color(): Color = Color(soulArgb)

/** Website `formatPlanTill` twin — `till 6 aug 2026`. */
fun formatPlanTill(iso: String?): String? {
    if (iso.isNullOrBlank()) return null
    return try {
        val instant = java.time.Instant.parse(iso)
        val z = instant.atZone(java.time.ZoneId.systemDefault())
        val day = z.dayOfMonth
        val mon = z.month.name.lowercase().take(3)
        val year = z.year
        "till $day $mon $year"
    } catch (_: Exception) {
        try {
            // date-only fallback YYYY-MM-DD
            val d = java.time.LocalDate.parse(iso.take(10))
            "till ${d.dayOfMonth} ${d.month.name.lowercase().take(3)} ${d.year}"
        } catch (_: Exception) {
            null
        }
    }
}

/**
 * Full-screen Plan catalog (S1) — website Account twin: souls, checks, App|Web.
 * Instant local apply until billing ships.
 */
@Composable
fun PlanCatalogHost(
    current: SubscriptionTier,
    onSelect: (SubscriptionTier) -> Unit,
    onDismiss: () -> Unit,
    reduceMotion: Boolean = AiiminTheme.reduceMotion,
    periodEndIso: String? = null,
    upgradeOnly: Boolean = false,
    focusTier: SubscriptionTier? = null,
    /** After celebration CTA — e.g. navigate to Today. */
    onContinueHome: (() -> Unit)? = null,
) {
    var pendingDegrade by remember { mutableStateOf<SubscriptionTier?>(null) }
    var celebration by remember { mutableStateOf<Pair<SubscriptionTier, SubscriptionTier>?>(null) }
    var detailTier by remember { mutableStateOf<SubscriptionTier?>(null) }
    /** S5 — website toast: `You're now on {Label}`. */
    var receiptToast by remember { mutableStateOf<String?>(null) }

    fun commit(next: SubscriptionTier) {
        val from = current
        onSelect(next)
        celebration = from to next
        receiptToast = "You're now on ${next.label}"
    }

    fun request(next: SubscriptionTier) {
        if (next == current) return
        if (upgradeOnly && next.rank < current.rank) {
            receiptToast = "Downgrades disabled until billing is live"
            return
        }
        if (next.rank < current.rank) {
            pendingDegrade = next
        } else {
            commit(next)
        }
    }

    Dialog(
        onDismissRequest = {
            if (celebration == null && pendingDegrade == null && detailTier == null) onDismiss()
            else if (detailTier != null) detailTier = null
        },
        properties = DialogProperties(usePlatformDefaultWidth = false),
    ) {
        Box(
            Modifier
                .fillMaxSize()
                .background(AiiminTheme.colors.bg),
        ) {
            PlanCatalogScreen(
                current = current,
                onRequestTier = ::request,
                onOpenDetail = { detailTier = it },
                onClose = onDismiss,
                periodEndIso = periodEndIso,
                upgradeOnly = upgradeOnly,
                focusTier = focusTier,
                modifier = Modifier.fillMaxSize(),
            )

            detailTier?.let { tier ->
                TierDetailSheet(
                    soul = tier.soul,
                    current = current,
                    onRequestTier = {
                        detailTier = null
                        request(it)
                    },
                    onClose = { detailTier = null },
                )
            }

            pendingDegrade?.let { next ->
                DegradeConfirmDialog(
                    from = current,
                    to = next,
                    onConfirm = {
                        pendingDegrade = null
                        commit(next)
                    },
                    onCancel = { pendingDegrade = null },
                )
            }

            celebration?.let { (from, to) ->
                TierCelebrationOverlay(
                    from = from,
                    to = to,
                    reduceMotion = reduceMotion,
                    onClose = {
                        celebration = null
                        onDismiss()
                        onContinueHome?.invoke()
                    },
                )
            }

            receiptToast?.let { msg ->
                LaunchedEffect(msg) {
                    delay(2_400)
                    receiptToast = null
                }
                PlanReceiptToast(
                    message = msg,
                    modifier = Modifier
                        .align(Alignment.BottomCenter)
                        .padding(bottom = 28.dp),
                )
            }
        }
    }
}

/** @deprecated Use [PlanCatalogHost]. */
@Composable
fun PlanSheet(
    current: SubscriptionTier,
    onSelect: (SubscriptionTier) -> Unit,
    onDismiss: () -> Unit,
) {
    PlanCatalogHost(current = current, onSelect = onSelect, onDismiss = onDismiss)
}

@Composable
private fun PlanReceiptToast(message: String, modifier: Modifier = Modifier) {
    Box(
        modifier
            .clip(PlanPillShape)
            .background(AiiminTheme.colors.surface)
            .border(Hairline, PlanCheck.copy(alpha = 0.55f), PlanPillShape)
            .padding(horizontal = 16.dp, vertical = 10.dp),
    ) {
        Text(
            text = message,
            style = AiiminTheme.type.bodySmall.copy(fontWeight = FontWeight.SemiBold, fontSize = 13.sp),
            color = AiiminTheme.colors.text,
        )
    }
}

@Composable
private fun PlanCatalogScreen(
    current: SubscriptionTier,
    onRequestTier: (SubscriptionTier) -> Unit,
    onOpenDetail: (SubscriptionTier) -> Unit,
    onClose: () -> Unit,
    periodEndIso: String? = null,
    upgradeOnly: Boolean = false,
    focusTier: SubscriptionTier? = null,
    modifier: Modifier = Modifier,
) {
    val currentSoul = current.soul
    val soulColor = currentSoul.color()
    val scroll = rememberScrollState()
    val till = formatPlanTill(periodEndIso)
    val ordered = remember(focusTier) {
        val all = TierSouls.all
        if (focusTier == null) all
        else all.sortedBy { if (it.tier == focusTier) 0 else it.tier.rank + 1 }
    }
    Column(
        modifier
            .verticalScroll(scroll)
            .padding(horizontal = AiiminTheme.space.page)
            .padding(top = AiiminTheme.space.s6, bottom = AiiminTheme.space.s8),
    ) {
        // Website Account head
        Text(
            text = "ACCOUNT",
            style = AiiminTheme.type.sectionLabel,
            color = AiiminTheme.colors.muted,
        )
        Text(
            text = "Subscription",
            style = AiiminTheme.type.figure.copy(fontSize = 28.sp, fontWeight = FontWeight.Bold),
            color = AiiminTheme.colors.text,
            modifier = Modifier.padding(top = 6.dp),
        )
        Text(
            text = "AIIMIN grows with you. Upgrade or switch any time.",
            style = AiiminTheme.type.bodySmall.copy(fontSize = 13.sp, lineHeight = 18.sp),
            color = AiiminTheme.colors.muted,
            modifier = Modifier.padding(top = 6.dp),
        )
        Text(
            text = "App + web share one tier · billing syncs when signed in.",
            style = AiiminTheme.type.bodySmall.copy(fontSize = 11.5.sp),
            color = AiiminTheme.colors.muted,
            modifier = Modifier.padding(top = 4.dp, bottom = AiiminTheme.space.s4),
        )

        Row(
            Modifier
                .fillMaxWidth()
                .clip(PlanCardShape)
                .border(Hairline, AiiminTheme.colors.rule, PlanCardShape)
                .background(AiiminTheme.colors.surface)
                .padding(horizontal = 16.dp, vertical = 14.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Box(
                Modifier
                    .size(8.dp)
                    .clip(CircleShape)
                    .background(soulColor),
            )
            Spacer(Modifier.width(12.dp))
            Text(
                text = "You're on ",
                style = AiiminTheme.type.bodySmall.copy(fontSize = 13.sp, fontWeight = FontWeight.SemiBold),
                color = AiiminTheme.colors.text,
            )
            Text(
                text = current.label,
                style = AiiminTheme.type.bodySmall.copy(fontSize = 13.sp, fontWeight = FontWeight.Bold),
                color = soulColor,
            )
            val meta = when {
                till != null -> "  · $till"
                current == SubscriptionTier.EXPLORE -> "  · Free plan"
                else -> "  · Manage plan"
            }
            Text(
                text = meta,
                style = AiiminTheme.type.bodySmall.copy(fontSize = 12.sp),
                color = AiiminTheme.colors.muted,
            )
        }

        if (focusTier != null && focusTier != current) {
            Text(
                text = "Needs ${focusTier.label} for that surface — card first below.",
                style = AiiminTheme.type.bodySmall.copy(fontSize = 12.sp, fontWeight = FontWeight.Medium),
                color = focusTier.soul.color(),
                modifier = Modifier.padding(top = AiiminTheme.space.s3),
            )
        }

        Text(
            text = "Founding rates still open for waitlist members.",
            style = AiiminTheme.type.bodySmall.copy(fontSize = 12.sp),
            color = AiiminTheme.colors.muted,
            modifier = Modifier.padding(top = AiiminTheme.space.s4, bottom = AiiminTheme.space.s3),
        )

        ordered.forEach { soul ->
            SoulTierCard(
                soul = soul,
                current = current,
                selected = soul.tier == current,
                upgradeOnly = upgradeOnly,
                highlighted = soul.tier == focusTier,
                onClick = { onRequestTier(soul.tier) },
                onMore = { onOpenDetail(soul.tier) },
                modifier = Modifier.padding(bottom = 16.dp),
            )
        }

        Text(
            text = "Complimentary Core at launch · founding Pro ₹49 · Elite ₹79. Same ladder as aiimin.in.",
            style = AiiminTheme.type.bodySmall.copy(fontSize = 10.5.sp, lineHeight = 15.sp),
            color = AiiminTheme.colors.muted,
            modifier = Modifier.padding(top = AiiminTheme.space.s2, bottom = AiiminTheme.space.s4),
        )

        GhostButton(
            label = "Close",
            onClick = onClose,
            modifier = Modifier.fillMaxWidth(),
        )
    }
}

@Composable
private fun SoulTierCard(
    soul: TierSoul,
    current: SubscriptionTier,
    selected: Boolean,
    onClick: () -> Unit,
    onMore: () -> Unit,
    upgradeOnly: Boolean = false,
    highlighted: Boolean = false,
    modifier: Modifier = Modifier,
) {
    val soulColor = soul.color()
    val isDegrade = soul.tier.rank < current.rank
    val blocked = upgradeOnly && isDegrade && !selected
    val border = when {
        highlighted -> soulColor.copy(alpha = 0.70f)
        selected -> soulColor.copy(alpha = 0.55f)
        soul.recommended -> AiiminTheme.colors.rule.copy(alpha = 1f)
        else -> AiiminTheme.colors.rule
    }
    val bg = if (selected) {
        Color(
            red = (soulColor.red * 0.12f + AiiminTheme.colors.surface.red * 0.88f),
            green = (soulColor.green * 0.12f + AiiminTheme.colors.surface.green * 0.88f),
            blue = (soulColor.blue * 0.12f + AiiminTheme.colors.surface.blue * 0.88f),
            alpha = 1f,
        )
    } else {
        AiiminTheme.colors.surface
    }

    Box(modifier = modifier) {
        Column(
            Modifier
                .fillMaxWidth()
                .clip(PlanCardShape)
                .border(Hairline, border, PlanCardShape)
                .background(bg),
        ) {
            // Top soul hair — website `border-top: 3px solid soul@70%`
            Box(
                Modifier
                    .fillMaxWidth()
                    .height(3.dp)
                    .background(soulColor.copy(alpha = 0.70f)),
            )
            Column(Modifier.padding(horizontal = 18.dp, vertical = 18.dp)) {
            // Header: icon well + name (website layout)
            Row(verticalAlignment = Alignment.CenterVertically) {
                TierIconWell(soul.icon, soulColor)
                Spacer(Modifier.width(10.dp))
                Text(
                    text = soul.label,
                    style = AiiminTheme.type.body.copy(fontSize = 17.sp, fontWeight = FontWeight.ExtraBold),
                    color = AiiminTheme.colors.text,
                )
            }

            Spacer(Modifier.height(10.dp))

            // Price block — website mono figure + / month + strike + founding note
            soul.listPriceInr?.let { list ->
                Text(
                    text = "₹$list",
                    style = AiiminTheme.type.mono(14.0, FontWeight.Bold).copy(
                        textDecoration = TextDecoration.LineThrough,
                    ),
                    color = AiiminTheme.colors.muted,
                )
            }
            Row(verticalAlignment = Alignment.Bottom) {
                Text(
                    text = if (soul.priceInr <= 0) "₹0" else "₹${soul.priceInr}",
                    style = AiiminTheme.type.mono(26.0, FontWeight.Black),
                    color = AiiminTheme.colors.text,
                )
                if (soul.priceInr > 0) {
                    Text(
                        text = " / month",
                        style = AiiminTheme.type.bodySmall.copy(fontSize = 11.sp, fontWeight = FontWeight.SemiBold),
                        color = AiiminTheme.colors.muted,
                        modifier = Modifier.padding(start = 4.dp, bottom = 4.dp),
                    )
                }
            }
            if (soul.listPriceInr != null) {
                Text(
                    text = "Waitlist founding rate",
                    style = AiiminTheme.type.bodySmall.copy(
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        letterSpacing = 0.4.sp,
                    ),
                    color = BrandSpark,
                    modifier = Modifier.padding(top = 2.dp, bottom = 8.dp),
                )
            } else {
                Spacer(Modifier.height(8.dp))
            }

            Text(
                text = soul.description,
                style = AiiminTheme.type.bodySmall.copy(fontSize = 12.sp, lineHeight = 17.sp),
                color = AiiminTheme.colors.muted,
            )

            Spacer(Modifier.height(16.dp))

            // Feature checks — website Account pack
            soul.featuresAccount.take(4).forEach { line ->
                FeatureCheckRow(line)
                Spacer(Modifier.height(8.dp))
            }
            if (soul.featuresAccount.size > 4) {
                TapSurface(onClick = onMore, minTouchTarget = false) {
                    Text(
                        text = "More",
                        style = AiiminTheme.type.bodySmall.copy(fontSize = 12.sp, fontWeight = FontWeight.Bold),
                        color = soulColor,
                        modifier = Modifier.padding(bottom = 8.dp),
                    )
                }
            }

            // App | Web interlink (native extras under web-parity features)
            Row(
                Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(10.dp))
                    .background(AiiminTheme.colors.bg.copy(alpha = 0.55f))
                    .padding(10.dp),
                horizontalArrangement = Arrangement.spacedBy(12.dp),
            ) {
                UnlockColumn("ON APP", soul.appUnlocks, Modifier.weight(1f))
                UnlockColumn("ON WEB", soul.webUnlocks, Modifier.weight(1f))
            }

            Text(
                text = "${soul.aiCallsPerDay} AI calls / day · shared pool",
                style = AiiminTheme.type.bodySmall.copy(fontSize = 10.5.sp),
                color = AiiminTheme.colors.muted,
                modifier = Modifier.padding(top = 10.dp, bottom = 14.dp),
            )

            when {
                selected -> {
                    Box(
                        Modifier
                            .fillMaxWidth()
                            .clip(PlanCtaShape)
                            .background(AiiminTheme.colors.bg)
                            .border(Hairline, AiiminTheme.colors.rule, PlanCtaShape)
                            .padding(vertical = 12.dp),
                        contentAlignment = Alignment.Center,
                    ) {
                        Text(
                            text = "Current plan",
                            style = AiiminTheme.type.chrome.copy(fontWeight = FontWeight.ExtraBold),
                            color = AiiminTheme.colors.muted,
                        )
                    }
                }
                soul.tier.rank > current.rank -> {
                    TapSurface(onClick = onClick) {
                        Box(
                            Modifier
                                .fillMaxWidth()
                                .clip(PlanCtaShape)
                                .background(soulColor)
                                .padding(vertical = 12.dp),
                            contentAlignment = Alignment.Center,
                        ) {
                            Text(
                                text = "Upgrade to ${soul.label} — ${soul.priceLabel()}",
                                style = AiiminTheme.type.chrome.copy(fontWeight = FontWeight.ExtraBold),
                                color = if (soul.tier == SubscriptionTier.PRO) Color.White else Color(0xFF1A1A1A),
                                textAlign = TextAlign.Center,
                            )
                        }
                    }
                }
                blocked -> {
                    Box(
                        Modifier
                            .fillMaxWidth()
                            .clip(PlanCtaShape)
                            .border(Hairline, AiiminTheme.colors.rule, PlanCtaShape)
                            .padding(vertical = 12.dp),
                        contentAlignment = Alignment.Center,
                    ) {
                        Text(
                            text = "Downgrade locked",
                            style = AiiminTheme.type.chrome.copy(fontWeight = FontWeight.ExtraBold),
                            color = AiiminTheme.colors.muted,
                        )
                    }
                }
                else -> {
                    // Switch / degrade — website `--switch` outline
                    TapSurface(onClick = onClick) {
                        Box(
                            Modifier
                                .fillMaxWidth()
                                .clip(PlanCtaShape)
                                .background(soulColor.copy(alpha = 0.12f))
                                .border(Hairline, soulColor.copy(alpha = 0.40f), PlanCtaShape)
                                .padding(vertical = 12.dp),
                            contentAlignment = Alignment.Center,
                        ) {
                            Text(
                                text = "Switch to ${soul.label}",
                                style = AiiminTheme.type.chrome.copy(fontWeight = FontWeight.ExtraBold),
                                color = soulColor,
                                textAlign = TextAlign.Center,
                            )
                        }
                    }
                }
            }
            }
        }

        if (soul.recommended && !selected) {
            Text(
                text = "MOST POPULAR",
                style = AiiminTheme.type.sectionLabel.copy(
                    fontSize = 9.sp,
                    fontWeight = FontWeight.ExtraBold,
                    letterSpacing = 1.sp,
                ),
                color = Color.White,
                modifier = Modifier
                    .align(Alignment.TopCenter)
                    .graphicsLayer { translationY = (-11).dp.toPx() }
                    .clip(PlanPillShape)
                    .background(BrandSpark)
                    .padding(horizontal = 10.dp, vertical = 3.dp),
            )
        }
        if (selected) {
            Text(
                text = "CURRENT PLAN",
                style = AiiminTheme.type.sectionLabel.copy(
                    fontSize = 9.sp,
                    fontWeight = FontWeight.ExtraBold,
                    letterSpacing = 1.sp,
                ),
                color = AiiminTheme.colors.bg,
                modifier = Modifier
                    .align(Alignment.TopCenter)
                    .graphicsLayer { translationY = (-11).dp.toPx() }
                    .clip(PlanPillShape)
                    .background(AiiminTheme.colors.text)
                    .padding(horizontal = 10.dp, vertical = 3.dp),
            )
        }
    }
}

@Composable
private fun FeatureCheckRow(line: String) {
    Row(
        verticalAlignment = Alignment.Top,
        horizontalArrangement = Arrangement.spacedBy(8.dp),
    ) {
        Canvas(Modifier.size(14.dp).padding(top = 1.dp)) {
            val stroke = Stroke(width = 2.2f, cap = StrokeCap.Round, join = StrokeJoin.Round)
            val p = Path().apply {
                moveTo(size.width * 0.15f, size.height * 0.52f)
                lineTo(size.width * 0.40f, size.height * 0.78f)
                lineTo(size.width * 0.88f, size.height * 0.22f)
            }
            drawPath(p, PlanCheck, style = stroke)
        }
        Text(
            text = line,
            style = AiiminTheme.type.bodySmall.copy(fontSize = 12.sp, lineHeight = 17.sp),
            color = AiiminTheme.colors.muted,
            modifier = Modifier.weight(1f),
        )
    }
}

/** S2 — full feature list + bestFor + CTA. */
@Composable
private fun TierDetailSheet(
    soul: TierSoul,
    current: SubscriptionTier,
    onRequestTier: (SubscriptionTier) -> Unit,
    onClose: () -> Unit,
) {
    val soulColor = soul.color()
    Box(
        Modifier
            .fillMaxSize()
            .background(AiiminTheme.colors.bg.copy(alpha = 0.94f)),
        contentAlignment = Alignment.BottomCenter,
    ) {
        Column(
            Modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(0.dp))
                .background(AiiminTheme.colors.bg)
                .border(Hairline, soulColor.copy(alpha = 0.40f), RoundedCornerShape(0.dp))
                .verticalScroll(rememberScrollState())
                .padding(AiiminTheme.space.page)
                .padding(bottom = AiiminTheme.space.s8),
        ) {
            Row(
                Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically,
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    TierIconWell(soul.icon, soulColor)
                    Spacer(Modifier.width(10.dp))
                    Column {
                        Text(
                            text = soul.label,
                            style = AiiminTheme.type.body.copy(fontSize = 17.sp, fontWeight = FontWeight.ExtraBold),
                            color = AiiminTheme.colors.text,
                        )
                        Text(
                            text = soul.priceLabel(),
                            style = AiiminTheme.type.mono(12.0, FontWeight.Medium),
                            color = AiiminTheme.colors.muted,
                        )
                    }
                }
                GhostButton(label = "Close", onClick = onClose)
            }

            Text(
                text = soul.taglineWaitlist,
                style = AiiminTheme.type.bodySmall.copy(fontSize = 13.sp, lineHeight = 18.sp),
                color = AiiminTheme.colors.text,
                modifier = Modifier.padding(top = AiiminTheme.space.s3),
            )
            Text(
                text = "Best for · ${soul.bestFor}",
                style = AiiminTheme.type.bodySmall.copy(fontSize = 12.sp, lineHeight = 17.sp),
                color = soulColor,
                modifier = Modifier.padding(top = AiiminTheme.space.s2),
            )

            HairRule(Modifier.padding(vertical = AiiminTheme.space.s3))

            Text(
                text = "INCLUDED",
                style = AiiminTheme.type.sectionLabel,
                color = AiiminTheme.colors.muted,
            )
            Spacer(Modifier.height(8.dp))
            soul.featuresAccount.forEach { line ->
                FeatureCheckRow(line)
                Spacer(Modifier.height(8.dp))
            }

            Text(
                text = "${soul.aiCallsPerDay} AI calls / day · shared pool",
                style = AiiminTheme.type.bodySmall.copy(fontSize = 11.5.sp),
                color = AiiminTheme.colors.muted,
                modifier = Modifier.padding(top = AiiminTheme.space.s3),
            )

            Spacer(Modifier.height(AiiminTheme.space.s4))

            Row(
                Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(AiiminTheme.space.s3),
            ) {
                UnlockColumn("ON APP", soul.appUnlocks, Modifier.weight(1f))
                UnlockColumn("ON WEB", soul.webUnlocks, Modifier.weight(1f))
            }

            Spacer(Modifier.height(AiiminTheme.space.s4))

            val selected = soul.tier == current
            when {
                selected -> {
                    Box(
                        Modifier
                            .fillMaxWidth()
                            .clip(PlanCtaShape)
                            .border(Hairline, AiiminTheme.colors.rule, PlanCtaShape)
                            .padding(vertical = 12.dp),
                        contentAlignment = Alignment.Center,
                    ) {
                        Text(
                            text = "Current plan",
                            style = AiiminTheme.type.chrome,
                            color = AiiminTheme.colors.muted,
                        )
                    }
                }
                soul.tier.rank > current.rank -> {
                    TapSurface(onClick = { onRequestTier(soul.tier) }) {
                        Box(
                            Modifier
                                .fillMaxWidth()
                                .clip(PlanCtaShape)
                                .background(soulColor)
                                .padding(vertical = 12.dp),
                            contentAlignment = Alignment.Center,
                        ) {
                            Text(
                                text = "Upgrade to ${soul.label}",
                                style = AiiminTheme.type.chrome.copy(fontWeight = FontWeight.ExtraBold),
                                color = if (soul.tier == SubscriptionTier.PRO) Color.White else Color(0xFF1A1A1A),
                            )
                        }
                    }
                }
                else -> {
                    TapSurface(onClick = { onRequestTier(soul.tier) }) {
                        Box(
                            Modifier
                                .fillMaxWidth()
                                .clip(PlanCtaShape)
                                .background(soulColor.copy(alpha = 0.12f))
                                .border(Hairline, soulColor.copy(alpha = 0.40f), PlanCtaShape)
                                .padding(vertical = 12.dp),
                            contentAlignment = Alignment.Center,
                        ) {
                            Text(
                                text = "Switch to ${soul.label}",
                                style = AiiminTheme.type.chrome.copy(fontWeight = FontWeight.ExtraBold),
                                color = soulColor,
                            )
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun UnlockColumn(title: String, items: List<String>, modifier: Modifier = Modifier) {
    Column(modifier) {
        Text(
            text = title,
            style = AiiminTheme.type.sectionLabel.copy(fontSize = 10.sp),
            color = AiiminTheme.colors.muted,
        )
        items.take(4).forEach { line ->
            Text(
                text = "· $line",
                style = AiiminTheme.type.bodySmall.copy(fontSize = 10.5.sp, lineHeight = 14.sp),
                color = AiiminTheme.colors.text,
                modifier = Modifier.padding(top = 3.dp),
            )
        }
    }
}

@Composable
private fun DegradeConfirmDialog(
    from: SubscriptionTier,
    to: SubscriptionTier,
    onConfirm: () -> Unit,
    onCancel: () -> Unit,
) {
    Dialog(onDismissRequest = onCancel) {
        Column(
            Modifier
                .fillMaxWidth()
                .clip(PlanCardShape)
                .background(AiiminTheme.colors.bg)
                .border(Hairline, to.soul.color().copy(alpha = 0.4f), PlanCardShape)
                .padding(AiiminTheme.space.s4),
        ) {
            Text(
                text = "SWITCH TO ${to.label.uppercase()}?",
                style = AiiminTheme.type.sectionLabel,
                color = to.soul.color(),
            )
            Text(
                text = "You'll lose Money / Lab on device until Core+. " +
                    "Web desk unlocks pause to ${to.label} ceiling. Continue?",
                style = AiiminTheme.type.bodySmall.copy(lineHeight = 18.sp),
                color = AiiminTheme.colors.muted,
                modifier = Modifier.padding(top = AiiminTheme.space.s2, bottom = AiiminTheme.space.s4),
            )
            PrimaryButton(
                label = "Switch to ${to.label}",
                onClick = onConfirm,
                modifier = Modifier.fillMaxWidth(),
            )
            Spacer(Modifier.height(AiiminTheme.space.s2))
            GhostButton(
                label = "Stay on ${from.label}",
                onClick = onCancel,
                modifier = Modifier.fillMaxWidth(),
            )
        }
    }
}

/**
 * S4 — identity-shift celebration (web TierUpgradeCelebration phases).
 *
 * hold → dissolve (old tier lifts away) → land (new name + tagline) →
 * unlock chips stagger → receipt → Continue to Today.
 */
@Composable
fun TierCelebrationOverlay(
    from: SubscriptionTier,
    to: SubscriptionTier,
    onClose: () -> Unit,
    reduceMotion: Boolean = false,
) {
    val soul = to.soul
    val soulColor = soul.color()
    val isUpgrade = to.rank >= from.rank

    val veil = remember { Animatable(0f) }
    val stageWash = remember { Animatable(0f) }
    val whisperAlpha = remember { Animatable(0f) }
    val holdDot = remember { Animatable(0.6f) }

    val fromAlpha = remember { Animatable(1f) }
    val fromY = remember { Animatable(0f) }
    val fromScale = remember { Animatable(1f) }
    val fromTrack = remember { Animatable(0f) } // 0 = tight, 1 = open

    val toAlpha = remember { Animatable(0f) }
    val toY = remember { Animatable(28f) }
    val toScale = remember { Animatable(0.92f) }
    val eyebrowAlpha = remember { Animatable(0f) }
    val taglineAlpha = remember { Animatable(0f) }

    val unlockAlphas = remember(to) {
        List(soul.unlocksCelebration.size.coerceAtLeast(1)) { Animatable(0f) }
    }
    val unlockYs = remember(to) {
        List(soul.unlocksCelebration.size.coerceAtLeast(1)) { Animatable(14f) }
    }

    val receiptAlpha = remember { Animatable(0f) }
    val receiptY = remember { Animatable(36f) }
    val ctaAlpha = remember { Animatable(0f) }

    var showWhisper by remember { mutableStateOf(true) }
    val whisper = remember(from, to) { soul.whisper(from) }
    val ctaLabel = if (isUpgrade) "Continue to Today" else soul.ctaContinue()

    LaunchedEffect(from, to, reduceMotion) {
        veil.snapTo(0f)
        stageWash.snapTo(0f)
        whisperAlpha.snapTo(0f)
        fromAlpha.snapTo(1f)
        fromY.snapTo(0f)
        fromScale.snapTo(1f)
        fromTrack.snapTo(0f)
        toAlpha.snapTo(0f)
        toY.snapTo(28f)
        toScale.snapTo(0.92f)
        eyebrowAlpha.snapTo(0f)
        taglineAlpha.snapTo(0f)
        unlockAlphas.forEach { it.snapTo(0f) }
        unlockYs.forEach { it.snapTo(14f) }
        receiptAlpha.snapTo(0f)
        receiptY.snapTo(36f)
        ctaAlpha.snapTo(0f)
        showWhisper = true

        veil.animateTo(1f, tween(280, easing = DraftEase))
        if (reduceMotion) {
            showWhisper = false
            fromAlpha.snapTo(0f)
            toAlpha.snapTo(1f)
            toY.snapTo(0f)
            toScale.snapTo(1f)
            eyebrowAlpha.snapTo(1f)
            taglineAlpha.snapTo(1f)
            unlockAlphas.forEach { it.snapTo(1f) }
            unlockYs.forEach { it.snapTo(0f) }
            receiptAlpha.snapTo(1f)
            receiptY.snapTo(0f)
            ctaAlpha.snapTo(1f)
            stageWash.snapTo(1f)
            return@LaunchedEffect
        }

        // ── hold (0–600) ──
        launch { whisperAlpha.animateTo(1f, tween(320, easing = DraftEase)) }
        launch { stageWash.animateTo(0.35f, tween(500, easing = DraftEase)) }
        launch {
            holdDot.animateTo(1f, tween(300, easing = DraftEase))
            holdDot.animateTo(0.55f, tween(280, easing = DraftEaseIn))
        }
        delay(600)

        // ── dissolve (600–1300): old tier lifts + opens ──
        launch {
            fromAlpha.animateTo(0f, tween(620, easing = FastOutSlowInEasing))
        }
        launch { fromY.animateTo(-28f, tween(620, easing = FastOutSlowInEasing)) }
        launch { fromScale.animateTo(1.06f, tween(620, easing = FastOutSlowInEasing)) }
        launch { fromTrack.animateTo(1f, tween(620, easing = FastOutSlowInEasing)) }
        launch { whisperAlpha.animateTo(0f, tween(400, easing = DraftEaseIn)) }
        delay(700)
        showWhisper = false

        // ── land (1300–2100): new identity ──
        launch { stageWash.animateTo(1f, tween(700, easing = MeetEase)) }
        launch { eyebrowAlpha.animateTo(1f, tween(360, easing = DraftEase)) }
        launch {
            toAlpha.animateTo(1f, tween(520, easing = MeetEase))
        }
        launch { toY.animateTo(0f, tween(720, easing = MeetEase)) }
        launch {
            toScale.animateTo(1.04f, tween(380, easing = DraftEase))
            toScale.animateTo(1f, tween(320, easing = MeetEase))
        }
        delay(280)
        launch { taglineAlpha.animateTo(1f, tween(480, easing = DraftEase)) }
        delay(520)

        // ── unlocks stagger (+70ms) ──
        soul.unlocksCelebration.indices.forEach { i ->
            launch {
                delay(i * 70L)
                launch { unlockAlphas[i].animateTo(1f, tween(380, easing = MeetEase)) }
                launch { unlockYs[i].animateTo(0f, tween(420, easing = MeetEase)) }
            }
        }
        delay(700L + soul.unlocksCelebration.size * 70L)

        // ── receipt + CTA ──
        launch { receiptAlpha.animateTo(1f, tween(480, easing = MeetEase)) }
        launch { receiptY.animateTo(0f, tween(560, easing = MeetEase)) }
        delay(220)
        ctaAlpha.animateTo(1f, tween(360, easing = DraftEase))
    }

    Box(
        Modifier
            .fillMaxSize()
            .graphicsLayer { alpha = veil.value }
            .background(AiiminTheme.colors.bg.copy(alpha = 0.96f)),
        contentAlignment = Alignment.Center,
    ) {
        Canvas(Modifier.fillMaxSize()) {
            val wash = stageWash.value
            drawCircle(
                brush = Brush.radialGradient(
                    colors = listOf(
                        soulColor.copy(alpha = 0.22f * wash),
                        soulColor.copy(alpha = 0.06f * wash),
                        Color.Transparent,
                    ),
                    center = Offset(center.x, size.height * 0.28f),
                    radius = size.minDimension * (0.42f + 0.18f * wash),
                ),
                radius = size.minDimension * (0.42f + 0.18f * wash),
                center = Offset(center.x, size.height * 0.28f),
            )
        }

        Column(
            Modifier
                .fillMaxWidth()
                .padding(horizontal = AiiminTheme.space.page)
                .verticalScroll(rememberScrollState()),
            horizontalAlignment = Alignment.CenterHorizontally,
        ) {
            Spacer(Modifier.height(AiiminTheme.space.s6))

            // Hold whisper
            if (showWhisper) {
                Row(
                    Modifier
                        .graphicsLayer { alpha = whisperAlpha.value }
                        .clip(PlanPillShape)
                        .border(Hairline, soulColor.copy(alpha = 0.35f), PlanPillShape)
                        .background(soulColor.copy(alpha = 0.08f))
                        .padding(horizontal = 14.dp, vertical = 9.dp),
                    verticalAlignment = Alignment.CenterVertically,
                ) {
                    Box(
                        Modifier
                            .size(8.dp)
                            .clip(CircleShape)
                            .graphicsLayer {
                                scaleX = 0.75f + 0.25f * holdDot.value
                                scaleY = 0.75f + 0.25f * holdDot.value
                            }
                            .background(soulColor),
                    )
                    Spacer(Modifier.width(10.dp))
                    Text(
                        text = whisper.uppercase(),
                        style = AiiminTheme.type.sectionLabel.copy(
                            fontSize = 11.sp,
                            letterSpacing = 1.6.sp,
                        ),
                        color = AiiminTheme.colors.muted,
                    )
                }
                Spacer(Modifier.height(AiiminTheme.space.s6))
            }

            // Identity zone — from dissolves, to lands (stacked same slot)
            Box(
                Modifier
                    .fillMaxWidth()
                    .height(140.dp),
                contentAlignment = Alignment.Center,
            ) {
                Text(
                    text = from.label.uppercase(),
                    style = AiiminTheme.type.sectionLabel.copy(
                        fontSize = 18.sp,
                        letterSpacing = (0.08f + 0.22f * fromTrack.value).em,
                        fontWeight = FontWeight.SemiBold,
                    ),
                    color = AiiminTheme.colors.muted,
                    modifier = Modifier.graphicsLayer {
                        alpha = fromAlpha.value
                        translationY = fromY.value
                        scaleX = fromScale.value
                        scaleY = fromScale.value
                    },
                )

                Column(
                    horizontalAlignment = Alignment.CenterHorizontally,
                    modifier = Modifier.graphicsLayer {
                        alpha = toAlpha.value
                        translationY = toY.value
                        scaleX = toScale.value
                        scaleY = toScale.value
                    },
                ) {
                    Text(
                        text = "YOU'RE ON",
                        style = AiiminTheme.type.sectionLabel.copy(letterSpacing = 1.4.sp),
                        color = soulColor,
                        modifier = Modifier.graphicsLayer { alpha = eyebrowAlpha.value },
                    )
                    Text(
                        text = to.label,
                        style = AiiminTheme.type.figure.copy(
                            fontSize = 48.sp,
                            fontWeight = FontWeight.Bold,
                        ),
                        color = AiiminTheme.colors.text,
                        modifier = Modifier.padding(top = 6.dp),
                    )
                    Text(
                        text = soul.taglineCelebration,
                        style = AiiminTheme.type.bodySmall.copy(
                            fontSize = 13.sp,
                            lineHeight = 18.sp,
                        ),
                        color = AiiminTheme.colors.muted,
                        textAlign = TextAlign.Center,
                        modifier = Modifier
                            .padding(top = AiiminTheme.space.s3)
                            .graphicsLayer { alpha = taglineAlpha.value },
                    )
                }
            }

            Spacer(Modifier.height(AiiminTheme.space.s4))

            // Unlock chips — staggered
            Column(
                verticalArrangement = Arrangement.spacedBy(8.dp),
                horizontalAlignment = Alignment.CenterHorizontally,
                modifier = Modifier.fillMaxWidth(),
            ) {
                soul.unlocksCelebration.forEachIndexed { i, chip ->
                    val a = unlockAlphas.getOrNull(i)?.value ?: 1f
                    val y = unlockYs.getOrNull(i)?.value ?: 0f
                    Row(
                        Modifier
                            .graphicsLayer {
                                alpha = a
                                translationY = y
                            }
                            .clip(PlanPillShape)
                            .border(Hairline, soulColor.copy(alpha = 0.30f), PlanPillShape)
                            .background(soulColor.copy(alpha = 0.10f))
                            .padding(horizontal = 14.dp, vertical = 9.dp),
                        verticalAlignment = Alignment.CenterVertically,
                    ) {
                        Canvas(Modifier.size(12.dp)) {
                            val stroke = Stroke(width = 2.2f, cap = StrokeCap.Round)
                            val p = Path().apply {
                                moveTo(size.width * 0.12f, size.height * 0.52f)
                                lineTo(size.width * 0.40f, size.height * 0.78f)
                                lineTo(size.width * 0.90f, size.height * 0.22f)
                            }
                            drawPath(p, soulColor, style = stroke)
                        }
                        Spacer(Modifier.width(8.dp))
                        Text(
                            text = chip,
                            style = AiiminTheme.type.bodySmall.copy(
                                fontSize = 12.5.sp,
                                fontWeight = FontWeight.Medium,
                            ),
                            color = AiiminTheme.colors.text,
                        )
                    }
                }
            }

            Spacer(Modifier.height(AiiminTheme.space.s6))

            // Receipt
            Column(
                Modifier
                    .fillMaxWidth()
                    .graphicsLayer {
                        alpha = receiptAlpha.value
                        translationY = receiptY.value
                    }
                    .clip(PlanCardShape)
                    .border(Hairline, soulColor.copy(alpha = 0.40f), PlanCardShape)
                    .background(soulColor.copy(alpha = 0.07f))
                    .padding(AiiminTheme.space.s4),
            ) {
                Row(
                    Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically,
                ) {
                    Text(
                        text = "AIIMIN",
                        style = AiiminTheme.type.cellLabel.copy(fontWeight = FontWeight.Bold),
                        color = AiiminTheme.colors.text,
                    )
                    Text(
                        text = "ACTIVE",
                        style = AiiminTheme.type.sectionLabel,
                        color = soulColor,
                    )
                }
                HairRule(Modifier.padding(vertical = AiiminTheme.space.s3))
                Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                    Text("Previous", style = AiiminTheme.type.bodySmall, color = AiiminTheme.colors.muted)
                    Text(
                        from.label,
                        style = AiiminTheme.type.bodySmall.copy(
                            textDecoration = TextDecoration.LineThrough,
                        ),
                        color = AiiminTheme.colors.muted,
                    )
                }
                Row(
                    Modifier
                        .fillMaxWidth()
                        .padding(top = 8.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                ) {
                    Text("New plan", style = AiiminTheme.type.bodySmall, color = AiiminTheme.colors.muted)
                    Text(
                        to.label,
                        style = AiiminTheme.type.bodySmall.copy(fontWeight = FontWeight.Bold),
                        color = soulColor,
                    )
                }
                Spacer(Modifier.height(AiiminTheme.space.s4))
                Box(Modifier.graphicsLayer { alpha = ctaAlpha.value }) {
                    TapSurface(onClick = onClose) {
                        Box(
                            Modifier
                                .fillMaxWidth()
                                .clip(PlanCtaShape)
                                .background(soulColor)
                                .padding(vertical = 14.dp),
                            contentAlignment = Alignment.Center,
                        ) {
                            Text(
                                text = ctaLabel.uppercase(),
                                style = AiiminTheme.type.chrome.copy(fontWeight = FontWeight.ExtraBold),
                                color = if (to == SubscriptionTier.PRO) Color.White else Color(0xFF1A1A1A),
                                textAlign = TextAlign.Center,
                            )
                        }
                    }
                }
            }

            Spacer(Modifier.height(AiiminTheme.space.s8))
        }
    }
}

/** Hard gate — soul of required tier. */
@Composable
fun TierGateWall(
    feature: TierFeature,
    current: SubscriptionTier,
    onOpenPlans: () -> Unit,
    onNotNow: (() -> Unit)? = null,
    modifier: Modifier = Modifier,
) {
    val need = feature.min.soul
    val needColor = need.color()
    Column(
        modifier
            .fillMaxWidth()
            .padding(AiiminTheme.space.s6),
        verticalArrangement = Arrangement.spacedBy(AiiminTheme.space.s3),
    ) {
        Text(
            text = feature.title.uppercase(),
            style = AiiminTheme.type.sectionLabel,
            color = AiiminTheme.colors.muted,
        )
        Text(
            text = "Needs ${feature.min.label}",
            style = AiiminTheme.type.figure.copy(fontSize = 28.sp),
            color = needColor,
        )
        Text(
            text = "You're on ${current.label}. This surface unlocks at ${feature.min.label} — " +
                "same ladder as aiimin.in. App gets the phone loop; web gets the desk OS.",
            style = AiiminTheme.type.bodySmall.copy(lineHeight = 18.sp),
            color = AiiminTheme.colors.muted,
        )
        Text(
            text = "App: ${need.appUnlocks.drop(1).take(2).joinToString(" · ").ifBlank { need.appUnlocks.first() }}",
            style = AiiminTheme.type.bodySmall.copy(fontSize = 11.5.sp),
            color = AiiminTheme.colors.text,
        )
        Text(
            text = "Web: ${need.webUnlocks.drop(1).take(2).joinToString(" · ").ifBlank { need.webUnlocks.first() }}",
            style = AiiminTheme.type.bodySmall.copy(fontSize = 11.5.sp),
            color = AiiminTheme.colors.text,
        )
        PrimaryButton(
            label = "View plans",
            onClick = onOpenPlans,
            modifier = Modifier.fillMaxWidth(),
        )
        if (onNotNow != null) {
            GhostButton(
                label = "Not now",
                onClick = onNotNow,
                modifier = Modifier.fillMaxWidth(),
            )
        }
    }
}

/**
 * S6 — website PlanStatusChip twin: Lucide icon well + LABEL only.
 * No "Manage plan" / "Free plan" chrome next to the tier name.
 */
@Composable
fun PlanStatusChip(
    tier: SubscriptionTier,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    inline: Boolean = true,
    periodEndIso: String? = null,
) {
    val soul = tier.soul
    val soulColor = soul.color()
    // periodEndIso kept for API parity with callers; till shows only as tooltip-less whisper on expand.
    val till = formatPlanTill(periodEndIso)
    TapSurface(onClick = onClick, minTouchTarget = false, modifier = modifier) {
        Row(
            Modifier
                .clip(if (inline) PlanPillShape else PlanCardShape)
                .border(Hairline, soulColor.copy(alpha = 0.40f), if (inline) PlanPillShape else PlanCardShape)
                .background(soulColor.copy(alpha = 0.10f))
                .padding(horizontal = 8.dp, vertical = 5.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Box(
                Modifier
                    .size(if (inline) 22.dp else 26.dp)
                    .clip(PlanIconShape)
                    .background(Color(0xFF1A1A1A).copy(alpha = if (AiiminTheme.colors.isDark) 0.55f else 0.08f))
                    .border(Hairline, soulColor.copy(alpha = 0.42f), PlanIconShape),
                contentAlignment = Alignment.Center,
            ) {
                TierIconGlyph(soul.icon, soulColor, glyph = 12.dp)
            }
            Spacer(Modifier.width(8.dp))
            Text(
                text = soul.label,
                style = AiiminTheme.type.bodySmall.copy(fontSize = 12.sp, fontWeight = FontWeight.Bold),
                color = soulColor,
            )
            if (till != null && !inline) {
                Box(
                    Modifier
                        .padding(horizontal = 7.dp)
                        .size(width = 1.dp, height = 10.dp)
                        .background(AiiminTheme.colors.rule),
                )
                Text(
                    text = till,
                    style = AiiminTheme.type.bodySmall.copy(fontSize = 11.sp),
                    color = AiiminTheme.colors.muted,
                )
            }
        }
    }
}

@Composable
private fun TierIconWell(kind: TierIconKind, soul: Color) {
    Box(
        Modifier
            .size(36.dp)
            .clip(PlanIconShape)
            .border(Hairline, soul.copy(alpha = 0.28f), PlanIconShape)
            .background(soul.copy(alpha = 0.12f)),
        contentAlignment = Alignment.Center,
    ) {
        TierIconGlyph(kind, soul, glyph = 18.dp)
    }
}

/** Lucide Compass / Layers / Zap / Crown ports — website Account icons. */
@Composable
private fun TierIconGlyph(kind: TierIconKind, soul: Color, glyph: androidx.compose.ui.unit.Dp) {
    Canvas(Modifier.size(glyph)) {
        val stroke = Stroke(width = size.minDimension * 0.12f, cap = StrokeCap.Round, join = StrokeJoin.Round)
        when (kind) {
            TierIconKind.Compass -> {
                // Lucide Compass: circle + diamond needle
                drawCircle(soul, radius = size.minDimension * 0.42f, style = stroke)
                val needle = Path().apply {
                    moveTo(size.width * 0.50f, size.height * 0.18f)
                    lineTo(size.width * 0.62f, size.height * 0.50f)
                    lineTo(size.width * 0.50f, size.height * 0.82f)
                    lineTo(size.width * 0.38f, size.height * 0.50f)
                    close()
                }
                drawPath(needle, soul)
            }
            TierIconKind.Layers -> {
                // Lucide Layers: three stacked chevrons
                fun layer(y0: Float, y1: Float, y2: Float) {
                    val p = Path().apply {
                        moveTo(size.width * 0.12f, y1)
                        lineTo(size.width * 0.50f, y0)
                        lineTo(size.width * 0.88f, y1)
                        lineTo(size.width * 0.50f, y2)
                        close()
                    }
                    drawPath(p, soul, style = stroke)
                }
                layer(0.08f * size.height, 0.28f * size.height, 0.48f * size.height)
                drawLine(
                    soul,
                    Offset(size.width * 0.12f, size.height * 0.52f),
                    Offset(size.width * 0.50f, size.height * 0.72f),
                    strokeWidth = stroke.width,
                    cap = StrokeCap.Round,
                )
                drawLine(
                    soul,
                    Offset(size.width * 0.88f, size.height * 0.52f),
                    Offset(size.width * 0.50f, size.height * 0.72f),
                    strokeWidth = stroke.width,
                    cap = StrokeCap.Round,
                )
                drawLine(
                    soul,
                    Offset(size.width * 0.12f, size.height * 0.68f),
                    Offset(size.width * 0.50f, size.height * 0.88f),
                    strokeWidth = stroke.width,
                    cap = StrokeCap.Round,
                )
                drawLine(
                    soul,
                    Offset(size.width * 0.88f, size.height * 0.68f),
                    Offset(size.width * 0.50f, size.height * 0.88f),
                    strokeWidth = stroke.width,
                    cap = StrokeCap.Round,
                )
            }
            TierIconKind.Zap -> {
                val p = Path().apply {
                    moveTo(size.width * 0.58f, size.height * 0.05f)
                    lineTo(size.width * 0.28f, size.height * 0.52f)
                    lineTo(size.width * 0.48f, size.height * 0.52f)
                    lineTo(size.width * 0.40f, size.height * 0.95f)
                    lineTo(size.width * 0.74f, size.height * 0.42f)
                    lineTo(size.width * 0.52f, size.height * 0.42f)
                    close()
                }
                drawPath(p, soul)
            }
            TierIconKind.Crown -> {
                val p = Path().apply {
                    moveTo(size.width * 0.10f, size.height * 0.78f)
                    lineTo(size.width * 0.10f, size.height * 0.42f)
                    lineTo(size.width * 0.32f, size.height * 0.58f)
                    lineTo(size.width * 0.50f, size.height * 0.18f)
                    lineTo(size.width * 0.68f, size.height * 0.58f)
                    lineTo(size.width * 0.90f, size.height * 0.42f)
                    lineTo(size.width * 0.90f, size.height * 0.78f)
                    close()
                }
                drawPath(p, soul, style = stroke)
                drawLine(
                    soul,
                    Offset(size.width * 0.10f, size.height * 0.88f),
                    Offset(size.width * 0.90f, size.height * 0.88f),
                    strokeWidth = stroke.width,
                    cap = StrokeCap.Round,
                )
            }
        }
    }
}
