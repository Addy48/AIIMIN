package aiimin.core.data.money.engine

object SenderAuthorityClassifier {
    private val TRUSTED_DLT_TOKENS = setOf(
        "HDFC", "HDFCBK", "SBI", "SBIINB", "SBIPSG", "ICICI", "ICICIB",
        "AXIS", "AXISBK", "KOTAK", "KOTAKB", "YESBNK", "YES", "IDFC",
        "IDFCFB", "PNBSMS", "PNB", "BOBTXN", "BOB", "CANBNK", "CANARA",
        "INDUSB", "INDUS", "SCISMS", "SCBANK", "CITIBK", "HSBCIN", "FEDBNK",
        "UNIONB", "RBLBNK", "RBL", "AUBANK", "BANDHN", "PAYTM", "PYTM",
        "GPAY", "PHNPE", "PHONEPE", "CRED", "SLICE", "JUPITR", "FIBANK",
        "AMZPAY", "AMAZON", "BHIM", "TATA", "AIRTEL", "MOBIKW", "FREECH",
        "BAJAJ", "BJFINS",
    )

    private val TRUSTED_NOTIFICATION_PACKAGES = setOf(
        "com.google.android.apps.nbu.paisa.user",
        "com.phonepe.app",
        "net.one97.paytm",
        "com.dreamplug.androidapp",
        "in.amazon.mShop.android.shopping",
        "in.org.npci.upiapp",
        "com.slicepay",
        "money.jupiter",
        "co.fi.money",
        "com.freecharge.android",
        "com.mobikwik_new",
        "com.hdfcbank.netbanking",
        "com.sbi.lotusintouch",
        "com.csam.icici.bank.imobile",
        "com.axis.mobile",
        "com.msf.kbank.mobile",
        "com.idfcfirstbank.optimus",
        "com.indusind.indusmobile",
        "com.aubank.mobile",
        "com.canarabank.ai1",
        "com.bankofbaroda.mconnect",
        "com.rblbank.mobank",
        "com.fedmobile",
    )

    fun isAuthorizedSmsSender(sender: String?): Boolean {
        if (sender.isNullOrBlank()) return false
        val clean = sender.trim().uppercase()
        val token = if (clean.contains('-')) clean.substringAfterLast('-') else clean
        if (token.matches(Regex("""\+?[0-9]{10,13}"""))) return false
        return TRUSTED_DLT_TOKENS.any { token.contains(it) }
    }

    fun isAuthorizedNotificationPackage(packageName: String?): Boolean {
        if (packageName.isNullOrBlank()) return false
        return TRUSTED_NOTIFICATION_PACKAGES.contains(packageName.trim())
    }
}
