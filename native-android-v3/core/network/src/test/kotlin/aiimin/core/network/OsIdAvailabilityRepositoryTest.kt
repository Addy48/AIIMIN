package aiimin.core.network

import com.google.common.truth.Truth.assertThat
import kotlinx.coroutines.test.runTest
import org.junit.Test

class OsIdAvailabilityRepositoryTest {

    @Test
    fun `invalid shape never hits the network`() = runTest {
        var called = false
        val api = object : FakeAiiminApi() {
            override suspend fun osIdAvailable(id: String): OsIdAvailableResponse {
                called = true
                error("should not call")
            }
        }
        val repo = OsIdAvailabilityRepository(api)
        val result = repo.check("BAD")
        assertThat(called).isFalse()
        assertThat(result.status).isEqualTo(OsIdAvailability.INVALID)
    }

    @Test
    fun `free id maps to AVAILABLE`() = runTest {
        val api = object : FakeAiiminApi() {
            override suspend fun osIdAvailable(id: String) = OsIdAvailableResponse(
                id = id,
                available = true,
                reason = "free",
                message = "Available.",
            )
        }
        val result = OsIdAvailabilityRepository(api).check("ADIT2K04")
        assertThat(result.status).isEqualTo(OsIdAvailability.AVAILABLE)
    }

    @Test
    fun `taken id maps to TAKEN`() = runTest {
        val api = object : FakeAiiminApi() {
            override suspend fun osIdAvailable(id: String) = OsIdAvailableResponse(
                id = id,
                available = false,
                reason = "taken",
                message = "Already claimed.",
            )
        }
        val result = OsIdAvailabilityRepository(api).check("AADI0837")
        assertThat(result.status).isEqualTo(OsIdAvailability.TAKEN)
    }
}
