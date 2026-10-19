package aiimin.core.network

import java.lang.reflect.Proxy

/**
 * Test double — override only the methods under exercise. Everything else is delegated to a
 * proxy that fails loudly, so new endpoints on [AiiminApi] never break unrelated tests.
 */
open class FakeAiiminApi : AiiminApi by unused()

private fun unused(): AiiminApi = Proxy.newProxyInstance(
    AiiminApi::class.java.classLoader,
    arrayOf(AiiminApi::class.java),
) { _, method, _ -> error("FakeAiiminApi.${method.name} is not stubbed in this test") } as AiiminApi
