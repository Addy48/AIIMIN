package aiimin.app.blocking

import android.accessibilityservice.AccessibilityService
import android.view.accessibility.AccessibilityEvent
import android.view.accessibility.AccessibilityNodeInfo
import aiimin.core.data.BlockRules

class AiiminAccessibilityService : AccessibilityService() {
    override fun onAccessibilityEvent(event: AccessibilityEvent?) {
        val packageName = event?.packageName?.toString() ?: return
        if (packageName == applicationContext.packageName) return
        val appBlocked = BlockRules.blockedPackages(applicationContext).contains(packageName)
        val browserContentBlocked = isBrowser(packageName) && rootInWindowIsBlocked(rootInActiveWindow)
        if (appBlocked || browserContentBlocked) performGlobalAction(GLOBAL_ACTION_HOME)
    }

    private fun isBrowser(packageName: String): Boolean = packageName in browserPackages

    private fun rootInWindowIsBlocked(root: AccessibilityNodeInfo?): Boolean {
        if (root == null) return false
        val text = buildString { collectText(root, this) }.take(20_000)
        return text.isNotBlank() && BlockRules.textIsBlocked(applicationContext, text)
    }

    private fun collectText(node: AccessibilityNodeInfo, out: StringBuilder) {
        node.text?.let { out.append(' ').append(it) }
        node.contentDescription?.let { out.append(' ').append(it) }
        for (index in 0 until node.childCount) {
            node.getChild(index)?.let { child -> collectText(child, out) }
        }
    }

    override fun onInterrupt() = Unit

    companion object {
        private val browserPackages = setOf(
            "com.android.chrome",
            "com.google.android.apps.chrome",
            "org.mozilla.firefox",
            "com.brave.browser",
            "com.microsoft.emmx",
            "com.opera.browser",
        )
    }
}
