package aiimin.core.nlp

import com.google.common.truth.Truth.assertThat
import org.junit.Test

class HinglishNormalizerTest {
    private fun n(s: String) = HinglishNormalizer.normalize(s)

    @Test fun `Devanagari digits become ASCII`() {
        assertThat(n("२४० का")).contains("240")
    }

    @Test fun `common Hindi words become the usual Hinglish spelling`() {
        assertThat(n("कल")).isEqualTo("kal")
        assertThat(n("परसों")).isEqualTo("parso")
        assertThat(n("शाम")).isEqualTo("shaam")
        assertThat(n("खर्च")).isEqualTo("kharch")
        assertThat(n("सुबह")).isEqualTo("subah")
        assertThat(n("बजे")).isEqualTo("baje")
        assertThat(n("सोमवार")).isEqualTo("somvar")
    }

    @Test fun `Devanagari and Roman twins normalise to the same text`() {
        assertThat(n("२४० का लंच किया")).isEqualTo(n("240 ka lunch kiya"))
        assertThat(n("कल 5 बजे रवि को कॉल करना")).isEqualTo(n("kal 5 baje ravi ko call karna"))
        assertThat(n("दो सौ रुपये की चाय")).isEqualTo(n("do sau rupaye ki chai"))
    }

    @Test fun `informal spellings are canonicalised`() {
        assertThat(n("kharcha")).isEqualTo("kharch")
        assertThat(n("rupaye")).isEqualTo(n("rupees"))
        assertThat(n("parson")).isEqualTo("parso")
        assertThat(n("shaam")).isEqualTo(n("sham"))
    }

    @Test fun `unknown Devanagari words still become readable Roman letters`() {
        val r = n("मोहन")
        assertThat(r).matches("[a-z ]+")
        assertThat(r).startsWith("moh")
    }

    @Test fun `English number words become digits`() {
        assertThat(n("spent two hundred on tea")).contains("200")
        assertThat(n("twelve hundred")).isEqualTo("1200")
        assertThat(n("two thousand five hundred")).isEqualTo("2500")
        assertThat(n("twenty five")).isEqualTo("25")
        assertThat(n("three hundred and fifty")).isEqualTo("350")
        assertThat(n("fifty two thousand")).isEqualTo("52000")
        assertThat(n("one lakh")).isEqualTo("100000")
    }

    @Test fun `Hindi number words become digits`() {
        assertThat(n("do sau")).isEqualTo("200")
        assertThat(n("paanch sau")).isEqualTo("500")
        assertThat(n("dedh sau")).isEqualTo("150")
        assertThat(n("dhai sau")).isEqualTo("250")
        assertThat(n("sava sau")).isEqualTo("125")
        assertThat(n("hazaar")).isEqualTo("1000")
        assertThat(n("pachaas")).isEqualTo("50")
        assertThat(n("do sau pachaas")).isEqualTo("250")
    }

    @Test fun `the word do and a lone one are not turned into numbers`() {
        assertThat(n("do the dishes")).isEqualTo("do the dishes")
        assertThat(n("one of the tasks")).isEqualTo("one of the tasks")
    }

    @Test fun `a lone small number word is read in a time or money slot`() {
        assertThat(n("call ravi at five")).isEqualTo("call ravi at 5")
        assertThat(n("teen baje")).isEqualTo("3 baje")
        assertThat(n("at three pm")).isEqualTo("at 3 pm")
    }
}
