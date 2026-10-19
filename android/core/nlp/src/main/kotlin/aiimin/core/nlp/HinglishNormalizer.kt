package aiimin.core.nlp

import java.math.BigDecimal
import java.text.Normalizer

/**
 * Everything typed or spoken is turned into lower-case Roman Hinglish before any parsing, so one parser
 * serves English, Hinglish and Hindi:
 *  1. Devanagari digits become ASCII digits.
 *  2. Devanagari words become Roman: a bundled lexicon of common words first (the usual Hinglish spelling,
 *     e.g. कल → kal), then a rule-based transliteration with schwa deletion for anything else.
 *  3. Informal Roman spellings are folded to one form (kharcha → kharch, parson → parso, rupaye → rupees).
 *  4. Number words (English and Hindi: "two hundred", "do sau", "dedh sau") become digits.
 *
 * The lexicon is hand-written (no licence to carry). Android's Transliterator is not used: it exists only
 * from API 29 and the app supports Android 8.
 */
object HinglishNormalizer {

    fun normalize(input: String): String {
        var s = Normalizer.normalize(input, Normalizer.Form.NFC)
        s = s.map { if (it in '०'..'९') ('0' + (it - '०')) else it }.joinToString("")
        s = DEVANAGARI_RUN.replace(s) { m -> " " + Devanagari.toRoman(m.value) + " " }
        s = s.lowercase().replace(Regex("""[ \t]+"""), " ").trim()
        s = foldSpellings(s)
        s = NumberWords.convert(s)
        return s.replace(Regex("""[ \t]+"""), " ").trim()
    }

    private val DEVANAGARI_RUN = Regex("""[ऀ-ॿ]+""")
    private val TOKEN = Regex("""[a-z]+""")

    private fun foldSpellings(s: String): String = TOKEN.replace(s) { m -> ALIASES[m.value] ?: m.value }

    /** informal spelling → canonical. Canonical forms are what every other file in this package matches on. */
    private val ALIASES: Map<String, String> = buildMap {
        fun alias(canon: String, vararg v: String) { v.forEach { put(it, canon) } }
        alias("kharch", "kharcha", "kharche", "kharchaa", "karch", "kharcho")
        alias("rupees", "rupaye", "rupay", "rupaiye", "rupiye", "rupaiya", "rupaya", "rupya", "rupe", "rupee", "ruppes", "rupes", "rupayo")
        alias("parso", "parson", "parsoon", "parsu", "parsho", "parsom")
        alias("narso", "narson")
        alias("shaam", "sham", "saam", "shaamko", "shyam")
        alias("subah", "subha", "subeh", "subh", "savere", "subhah")
        alias("dopahar", "dophar", "dopehar", "dupahar", "dupaher")
        alias("baje", "bje", "bajey", "baj", "bajae")
        alias("aaj", "aj", "aajj")
        alias("hafte", "hafta", "haphta", "haftey", "hapte")
        alias("mahine", "mahina", "mahinay", "mahinaa")
        alias("somvar", "somwar", "sombar", "somvaar", "somwaar")
        alias("mangalvar", "mangalwar", "mangal", "mangalvaar", "mangalbar")
        alias("budhvar", "budhwar", "budh", "budhvaar", "budhbar")
        alias("guruvar", "guruwar", "gurvar", "veervar", "virvar", "brihaspativar", "brihaspatwar", "guruvaar", "vrihaspativar")
        alias("shukravar", "shukrawar", "shukra", "shukrvar", "shukravaar", "sukravar")
        alias("shanivar", "shaniwar", "shani", "shanivaar", "shanibar", "shanichar")
        alias("ravivar", "raviwar", "itwar", "itvar", "ravivaar", "itwaar", "aitvar")
        alias("diye", "diyaa", "diyee", "diy", "diyye")
        alias("diya", "diyaa")
        alias("udhaar", "udhar", "udhaaar", "udhaari")
        alias("kiya", "kia", "kiyaa", "kiyaaa")
        alias("kiye", "kiyee")
        alias("liya", "lia", "liyaa")
        alias("bheje", "bhej", "bhejey", "bheeje")
        alias("accha", "acha", "achha", "achcha", "acchaa", "achchha")
        alias("hu", "hoon", "hun", "hoon", "hu")
        alias("paise", "paisa", "paisay", "paisey")
        alias("khana", "khaana", "khaanaa")
        alias("hazaar", "hazar", "hajar", "hajaar", "hazzar", "hajaarr")
        alias("lakh", "lac", "lacs", "lakhs", "laakh", "lakkh")
        alias("crore", "crores", "karod", "karor", "karore")
        alias("dedh", "derh", "dedhh")
        alias("dhai", "dhaai", "adhai", "dhaaii")
        alias("sava", "savaa", "sawa")
        alias("saadhe", "sadhe", "saade")
        alias("paune", "poune", "paunay")
        alias("nahi", "nahin", "nhi", "nai", "nahee")
        alias("mummy", "mumma", "mamma")
        alias("karna", "krna", "karnaa")
        alias("hai", "hae")
    }
}

/** Rule-based Devanagari → Roman with a bundled word list in front of it. */
internal object Devanagari {

    fun toRoman(word: String): String {
        val key = key(word)
        LEXICON[key]?.let { return it }
        val rule = rules(key)
        return PHONETIC[phoneticKey(rule)] ?: rule
    }

    /** Drop nukta, fold chandrabindu to anusvara so one spelling matches many. */
    private fun key(w: String): String = w.replace("़", "").replace('ँ', 'ं')

    private val CONS = mapOf(
        'क' to "k", 'ख' to "kh", 'ग' to "g", 'घ' to "gh", 'ङ' to "n", 'च' to "ch", 'छ' to "chh", 'ज' to "j", 'झ' to "jh", 'ञ' to "n",
        'ट' to "t", 'ठ' to "th", 'ड' to "d", 'ढ' to "dh", 'ण' to "n", 'त' to "t", 'थ' to "th", 'द' to "d", 'ध' to "dh", 'न' to "n",
        'प' to "p", 'फ' to "ph", 'ब' to "b", 'भ' to "bh", 'म' to "m", 'य' to "y", 'र' to "r", 'ल' to "l", 'व' to "v", 'श' to "sh",
        'ष' to "sh", 'स' to "s", 'ह' to "h", 'ळ' to "l",
    )
    private val INDEP = mapOf(
        'अ' to "a", 'आ' to "aa", 'इ' to "i", 'ई' to "ee", 'उ' to "u", 'ऊ' to "oo", 'ऋ' to "ri", 'ए' to "e", 'ऐ' to "ai", 'ओ' to "o", 'औ' to "au", 'ऑ' to "o",
    )
    private val MATRA = mapOf(
        'ा' to "aa", 'ि' to "i", 'ी' to "ee", 'ु' to "u", 'ू' to "oo", 'े' to "e", 'ै' to "ai", 'ो' to "o", 'ौ' to "au", 'ृ' to "ri", 'ॉ' to "o", 'ॅ' to "e",
    )
    private const val VIRAMA = '्'

    private class Piece(val text: String, val inherent: Boolean)

    private fun rules(w: String): String {
        var i = 0
        val out = StringBuilder()
        // First pass: build syllables; pending inherent vowels are decided after.
        val pieces = ArrayList<Piece>()
        while (i < w.length) {
            val c = w[i]
            when {
                c in CONS -> {
                    var cons = CONS.getValue(c)
                    i++
                    // conjuncts: C + virama + C ...
                    var inherent = true
                    while (i < w.length && w[i] == VIRAMA) {
                        i++
                        if (i < w.length && w[i] in CONS) { cons += CONS.getValue(w[i]); i++ } else { inherent = false; break }
                    }
                    if (inherent && i < w.length && w[i] in MATRA) { pieces += Piece(cons + MATRA.getValue(w[i]), false); i++ }
                    else if (inherent) pieces += Piece(cons, true)
                    else pieces += Piece(cons, false)
                }
                c in INDEP -> { pieces += Piece(INDEP.getValue(c), false); i++ }
                c == 'ं' -> { pieces += Piece("n", false); i++ }
                c == 'ः' -> { pieces += Piece("h", false); i++ }
                c in MATRA -> { pieces += Piece(MATRA.getValue(c), false); i++ }
                c == 'ऽ' || c == '।' || c == '॥' -> i++
                else -> { pieces += Piece(c.toString(), false); i++ }
            }
        }
        // Schwa deletion: drop the inherent 'a' at the end of a word, and in the middle when
        // the neighbouring syllables carry vowels (kamala → kamla).
        val n = pieces.size
        for ((idx, p) in pieces.withIndex()) {
            if (!p.inherent) { out.append(p.text); continue }
            val last = idx == n - 1
            val prevHasVowel = idx > 0 && hasVowel(pieces[idx - 1])
            val next = pieces.getOrNull(idx + 1)
            val nextAfter = pieces.getOrNull(idx + 2)
            val keep = when {
                last -> false
                idx == 0 -> true
                !prevHasVowel -> true
                next != null && !next.inherent && next.text.firstOrNull() in "aeiou".toList() && !startsWithCons(next) -> true
                nextAfter == null && next != null && next.inherent -> true // …Ca Ca$ : keep the penultimate
                else -> false
            }
            out.append(p.text)
            if (keep) out.append('a')
        }
        return out.toString()
    }

    private fun hasVowel(p: Piece): Boolean = !p.inherent || p.text.any { it in "aeiou" }
    private fun startsWithCons(p: Piece): Boolean = p.text.firstOrNull()?.let { it !in "aeiou" } ?: false

    fun phoneticKey(w: String): String {
        var s = w.lowercase()
        for ((a, b) in listOf("chh" to "c", "ch" to "c", "sh" to "s", "kh" to "k", "gh" to "g", "th" to "t", "dh" to "d", "ph" to "f", "bh" to "b", "jh" to "j",
            "aa" to "a", "ee" to "i", "ii" to "i", "oo" to "u", "uu" to "u", "ai" to "e", "au" to "o", "ay" to "e", "w" to "v", "z" to "j", "x" to "ks")) s = s.replace(a, b)
        s = Regex("""(.)\1+""").replace(s, "$1")
        return s.trimEnd('a', 'h').ifEmpty { s }
    }

    private val LEXICON: Map<String, String> by lazy {
        buildMap {
            for (line in LEXICON_TEXT.lines()) {
                val l = line.trim()
                if (l.isEmpty() || l.startsWith("#")) continue
                val parts = l.split(Regex("""\s+"""))
                val roman = parts.last()
                for (d in parts.dropLast(1)) put(key(d), roman)
            }
        }
    }

    /** Roman side of the lexicon, by phonetic key: lets a rule-based spelling snap to the usual one. */
    private val PHONETIC: Map<String, String> by lazy {
        val m = HashMap<String, String>()
        for (v in LEXICON.values) if (v.length > 2 && v !in NumberWords.words()) m.putIfAbsent(phoneticKey(v), v)
        m
    }

    // devanagari-variants... roman
    private const val LEXICON_TEXT = """
# time and days
कल kal
आज aaj
परसों परसो parso
नरसों narso
सुबह सवेरे subah
शाम shaam
रात raat
दोपहर dopahar
बजे baje
तक tak
अगले agle
अगला agla
पिछले pichhle
इस is
हफ्ते हफ़्ते hafte
हफ्ता हफ़्ता hafta
सप्ताह hafta
महीने mahine
महीना mahina
साल saal
दिन din
घंटे ghante
घंटा ghanta
मिनट minute
रोज़ रोज roz
रोजाना रोज़ाना rozana
हर har
सोमवार somvar
मंगलवार mangalvar
बुधवार budhvar
गुरुवार गुरूवार guruvar
वीरवार veervar
शुक्रवार shukravar
शनिवार shanivar
रविवार ravivar
इतवार itwar
# money
रुपये रूपये रुपए रुपैया rupaye
रुपया rupaya
रु रू rs
खर्च kharch
खर्चा kharcha
किराया kiraya
किराना kirana
उधार udhaar
फीस फ़ीस fees
बिल bill
सैलरी salary
तनख्वाह तनख़्वाह tankhwah
बोनस bonus
रिफंड refund
कैशबैक cashback
पैसे paise
पैसा paisa
हज़ार हजार hazaar
सौ sau
लाख lakh
करोड़ करोड crore
डेढ़ डेढ dedh
ढाई dhai
सवा sava
साढ़े साढे saadhe
पौने paune
# numbers
एक ek
दो do
तीन teen
चार chaar
पाँच पांच paanch
छह छः छे chhe
सात saat
आठ aath
नौ nau
दस das
ग्यारह gyarah
बारह barah
तेरह terah
चौदह chaudah
पंद्रह पन्द्रह pandrah
सोलह solah
सत्रह satrah
अठारह atharah
उन्नीस unnis
बीस bees
इक्कीस ikkis
बाईस baais
तेईस teis
चौबीस chaubis
पच्चीस pachchis
छब्बीस chhabbis
सत्ताईस sattais
अट्ठाईस atthais
उनतीस untis
तीस tees
इकतीस ikatis
बत्तीस battis
तैंतीस taintis
चौंतीस chauntis
पैंतीस paintis
छत्तीस chhattis
सैंतीस saintis
अड़तीस adtis
उनतालीस unchalis
चालीस chalis
इकतालीस ikatalis
बयालीस bayalis
तैंतालीस taitalis
चवालीस चौवालीस chauvalis
पैंतालीस paitalis
छियालीस chhiyalis
सैंतालीस saitalis
अड़तालीस adtalis
उनचास unchaas
पचास pachaas
इक्यावन ikyavan
बावन bavan
तिरपन tirpan
चौवन chauvan
पचपन pachpan
छप्पन chhappan
सत्तावन sattavan
अट्ठावन atthavan
उनसठ unsath
सत्तर sattar
अस्सी assi
नब्बे nabbe
# verbs and helpers
किया kiya
किए kiye
करना karna
करनी karni
करने karne
करो karo
दिया diya
दिए diye
दी di
भर bhar
भरा bhara
भरी bhari
भरे bhare
भरना bharna
लिया liya
ली li
लिए liye
भेजा bheja
भेजे bheje
भेजना bhejna
भेजनी bhejni
जाना jaana
जाने jaane
जाऊँगा jaunga
लेना lena
लेनी leni
देना dena
मिला mila
मिली mili
मिलना milna
आया aaya
आई aayi
आए aaye
उठना uthna
लाना laana
लाया laaya
धोना dhona
उड़ा uda
खाया khaya
पिया piya
पी pi
लगी lagi
लगा laga
खरीदा kharida
डलवाया dalwaya
जमा jama
है hai
हैं hain
हूँ हूं hu
था tha
थी thi
हो ho
होगा hoga
चाहिए chahiye
रहा raha
रही rahi
गया gaya
बात baat
बुक book
रिन्यू renew
कॉल call
फोन phone
# particles
का ka
के ke
की ki
को ko
से se
में me
पर par
पे pe
और aur
या ya
ने ne
भी bhi
ही hi
नहीं nahi
मैंने maine
मुझे mujhe
मेरा mera
मेरी meri
मैं main
हम hum
तुम tum
वो wo
ये ye
यह yah
कुछ kuch
बहुत bahut
थोड़ा थोडा thoda
अच्छा accha
अच्छी acchi
बुरा bura
ज़्यादा ज्यादा zyada
कम kam
फिर phir
तब tab
जब jab
क्या kya
कब kab
कहाँ कहां kahan
क्यों kyun
साथ saath
वाला wala
वाली wali
वाले wale
वापस wapas
# things
खाना khana
चाय chai
दूध doodh
सब्ज़ी सब्जी sabzi
दवाई दवा dawai
बिजली bijli
पानी paani
पेट्रोल petrol
डीजल diesel
राशन ration
नाश्ता nashta
लंच lunch
डिनर dinner
पिज़्ज़ा पिज्जा pizza
ऑटो auto
रिक्शा rickshaw
टैक्सी taxi
बस bus
मेट्रो metro
मूवी movie
फिल्म film
टिकट टिकिट ticket
रिचार्ज recharge
वाईफाई वाइफाई wifi
गैस gas
सिलेंडर cylinder
स्कूल school
कॉलेज college
बैंक bank
डॉक्टर doctor
अस्पताल hospital
जिम gym
सैलून salon
कपड़े kapde
जूते joote
किताब kitab
मोबाइल mobile
घर ghar
गाड़ी gaadi
बाइक bike
मम्मी mummy
माँ मां maa
पापा papa
भाई bhai
भैया bhaiya
दीदी didi
दोस्त dost
रवि ravi
प्रिया priya
रिपोर्ट report
मीटिंग meeting
इंश्योरेंस insurance
पासपोर्ट passport
पौधों paudhon
पौधे paudhe
फूल phool
योग yoga
सर्विस service
फॉर्म form
पान paan
पैसे paise
सफाई safai
साफ saaf
डॉक्टर doctor
अपॉइंटमेंट appointment
नोट note
आइडिया idea
सूची list
योग yoga
किया kiya
# feelings
मन mann
दिल dil
खुश khush
थका thaka
थकी thaki
हुआ hua
तनाव tanav
टेंशन tension
उदास udaas
परेशान pareshan
"""
}

/** English and Hindi number words → digits. */
internal object NumberWords {

    private val UNITS: Map<String, Int> = buildMap {
        val en = listOf("zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen",
            "fifteen", "sixteen", "seventeen", "eighteen", "nineteen", "twenty")
        en.forEachIndexed { i, w -> put(w, i) }
        listOf("thirty" to 30, "forty" to 40, "fifty" to 50, "sixty" to 60, "seventy" to 70, "eighty" to 80, "ninety" to 90).forEach { put(it.first, it.second) }
        // Hindi (Roman, canonical spellings from the normaliser)
        val hi = mapOf(
            "ek" to 1, "do" to 2, "teen" to 3, "chaar" to 4, "char" to 4, "paanch" to 5, "panch" to 5, "paach" to 5, "chhe" to 6, "chhah" to 6, "chhai" to 6,
            "saat" to 7, "aath" to 8, "nau" to 9, "das" to 10, "gyarah" to 11, "gyaarah" to 11, "barah" to 12, "baarah" to 12, "chaudah" to 14, "pandrah" to 15,
            "solah" to 16, "satrah" to 17, "atharah" to 18, "unnis" to 19, "bees" to 20, "ikkis" to 21, "baais" to 22, "teis" to 23, "chaubis" to 24,
            "pachchis" to 25, "pacchis" to 25, "pachis" to 25, "chhabbis" to 26, "sattais" to 27, "atthais" to 28, "untis" to 29, "tees" to 30, "ikatis" to 31,
            "battis" to 32, "taintis" to 33, "chauntis" to 34, "paintis" to 35, "chhattis" to 36, "saintis" to 37, "adtis" to 38, "unchalis" to 39, "chalis" to 40,
            "ikatalis" to 41, "bayalis" to 42, "taitalis" to 43, "chauvalis" to 44, "paitalis" to 45, "chhiyalis" to 46, "saitalis" to 47, "adtalis" to 48,
            "unchaas" to 49, "pachaas" to 50, "pachas" to 50, "ikyavan" to 51, "bavan" to 52, "tirpan" to 53, "chauvan" to 54, "pachpan" to 55, "chhappan" to 56,
            "sattavan" to 57, "atthavan" to 58, "unsath" to 59, "sattar" to 70, "assi" to 80, "nabbe" to 90,
        )
        putAll(hi)
    }
    private val SCALE: Map<String, BigDecimal> = mapOf(
        "hundred" to BigDecimal(100), "sau" to BigDecimal(100), "thousand" to BigDecimal(1000), "hazaar" to BigDecimal(1000),
        "lakh" to BigDecimal(100_000), "crore" to BigDecimal(10_000_000), "million" to BigDecimal(1_000_000),
    )
    private val FRACTION: Map<String, BigDecimal> = mapOf("dedh" to BigDecimal("1.5"), "dhai" to BigDecimal("2.5"), "sava" to BigDecimal("1.25"))
    private val ADJUST: Map<String, BigDecimal> = mapOf("saadhe" to BigDecimal("0.5"), "paune" to BigDecimal("-0.25"))

    /** A lone small number word is a number only in a clock or money slot ("at five", "teen baje"); otherwise it is a word ("do the dishes"). */
    private val LONE_NEXT = setOf("baje", "am", "pm", "rupees", "rs", "dollars", "dollar", "euros", "euro", "pounds", "pound", "usd", "inr", "aud", "gbp", "eur", "aed",
        "minutes", "minute", "min", "mins", "ghante", "hours", "hour", "hrs", "pages", "litres", "litre", "lakh", "k", "o'clock")
    private val LONE_PREV = setOf("at", "past", "to", "till", "by", "around", "about", "for", "rs", "rupees", "paid", "spent", "gave", "mood", "focus", "pomodoro", "kharch")
    private val CLOCK_PREV = setOf("at", "past", "to", "till", "by", "baje")
    private val ORDINAL = mapOf(
        "third" to 3, "fourth" to 4, "fifth" to 5, "sixth" to 6, "seventh" to 7, "eighth" to 8, "ninth" to 9, "tenth" to 10, "eleventh" to 11, "twelfth" to 12,
        "thirteenth" to 13, "fourteenth" to 14, "fifteenth" to 15, "sixteenth" to 16, "seventeenth" to 17, "eighteenth" to 18, "nineteenth" to 19, "twentieth" to 20,
    )

    fun words(): Set<String> = UNITS.keys + SCALE.keys + FRACTION.keys + ADJUST.keys

    private fun isNum(t: String) = t in UNITS || t in SCALE || t in FRACTION || t in ADJUST

    fun convert(s: String): String {
        val raw = s.split(' ')
        // separate trailing punctuation so "two hundred," still converts
        val words = raw.map { it.trimEnd(',', '.', '!', '?', ';', ':') }
        val tails = raw.mapIndexed { i, r -> r.substring(words[i].length) }
        val out = ArrayList<String>()
        var i = 0
        while (i < words.size) {
            val w = words[i]
            if (w in ORDINAL && out.lastOrNull() in setOf("on", "the", "by", "due", "from")) {
                out += ORDINAL.getValue(w).toString() + "th" + tails[i]; i++; continue
            }
            if (!isNum(w)) { out += w + tails[i]; i++; continue }
            // a run of number words, allowing "and" between two of them
            var j = i
            val run = ArrayList<String>()
            while (j < words.size) {
                val t = words[j]
                if (isNum(t)) { run += t; j++; if (tails[j - 1].isNotEmpty()) break }
                else if (t == "and" && run.isNotEmpty() && j + 1 < words.size && isNum(words[j + 1]) && tails[j - 1].isEmpty()) { j++ }
                else break
            }
            // "2 lakh", "5 hazaar": a digit before a scale word keeps the word; the money parser reads the pair
            if (run.first() in SCALE && words.getOrNull(i - 1)?.firstOrNull()?.isDigit() == true) { out += w + tails[i]; i++; continue }
            val value = eval(run, clockSlot = words.getOrNull(i - 1) in CLOCK_PREV)
            val lone = run.size == 1 && run[0] in UNITS && (UNITS.getValue(run[0]) <= 10)
            val gated = lone && !(words.getOrNull(j) in LONE_NEXT || words.getOrNull(i - 1) in LONE_PREV)
            if (value == null || gated) {
                // not one number: emit this word alone (a clock/money slot may still make it a number) and re-scan from the next
                val alone = if (run.size > 1) eval(listOf(w)) else null
                val slot = words.getOrNull(i + 1) in LONE_NEXT || words.getOrNull(i - 1) in LONE_PREV
                val smallWord = (UNITS[w] ?: 100) <= 10
                if (alone != null && (!smallWord || slot)) out += alone.stripTrailingZeros().toPlainString() + tails[i]
                else out += w + tails[i]
                i++
                continue
            }
            out += value.stripTrailingZeros().toPlainString() + tails[j - 1]
            i = j
        }
        return out.joinToString(" ")
    }

    private fun eval(run: List<String>, clockSlot: Boolean = false): BigDecimal? {
        var total = BigDecimal.ZERO
        var cur = BigDecimal.ZERO
        var adjust = BigDecimal.ZERO
        var seen = false
        // "five thirty" (a unit then a bigger tens word) is two numbers, not 35: reject and keep the words apart
        for ((idx, t) in run.withIndex()) {
            when {
                t in ADJUST -> adjust = ADJUST.getValue(t)
                t in FRACTION -> { cur += FRACTION.getValue(t); seen = true }
                t in UNITS -> {
                    val v = BigDecimal(UNITS.getValue(t)) + adjust
                    adjust = BigDecimal.ZERO
                    val prev = run.getOrNull(idx - 1)
                    if (prev != null && prev in UNITS && cur.signum() != 0 && cur.remainder(BigDecimal(100)).signum() != 0 && !(UNITS.getValue(prev) >= 20 && UNITS.getValue(t) < 10)) {
                        // "two fifty" is 250 in money talk but 2:50 after "at": the caller decides by what comes before the run
                        if (clockSlot || run.size != 2 || UNITS.getValue(prev) !in 1..99 || UNITS.getValue(t) < 10) return null
                        cur = cur * BigDecimal(100) + v
                        seen = true
                        continue
                    }
                    cur += v; seen = true
                }
                t in SCALE -> {
                    val sc = SCALE.getValue(t)
                    if (sc == BigDecimal(100)) { cur = (if (cur.signum() == 0) BigDecimal.ONE else cur) * sc }
                    else { total += (if (cur.signum() == 0) BigDecimal.ONE else cur) * sc; cur = BigDecimal.ZERO }
                    seen = true
                }
            }
        }
        return if (seen) total + cur else null
    }
}
