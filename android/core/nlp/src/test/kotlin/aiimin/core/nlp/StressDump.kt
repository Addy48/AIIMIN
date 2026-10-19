package aiimin.core.nlp
import org.junit.Test
import java.io.File
class StressDump {
    @Test fun dump() {
        val f = File("/tmp/stress/in.txt"); if (!f.exists()) return
        val out = f.readLines().filter { it.isNotBlank() }.joinToString("\n") { t ->
            val a = CaptureEngine.analyze(t, TEST_NOW)
            t + " [" + CaptureEngine.splitClauses(a.normalized).joinToString("/") + "]  =>  " + a.items.joinToString(" ++ ") { "${it.kind}${it.paise?.let { p -> "/$p${it.currency}" } ?: ""}${it.date?.let { d -> "/$d" } ?: ""}${it.time24?.let { x -> "@$x" } ?: ""}${it.recurrence?.let { r -> "~$r" } ?: ""} '${it.label}'" + if (it.kind == Kind.CHOOSE) "(${it.reason})" else "" }
        }
        File("/tmp/stress/out.txt").writeText(out)
    }
}
