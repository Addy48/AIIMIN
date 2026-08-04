package aiimin.core.network

import kotlinx.serialization.Serializable

@Serializable
data class OsIdAvailableResponse(
    val id: String? = null,
    val available: Boolean? = null,
    val reason: String? = null,
    val message: String? = null,
    val error: String? = null,
)

@Serializable
data class ParseRequest(val text: String)

@Serializable
data class ParseChipDto(
    val field: String,
    val value: String,
    val included: Boolean = true,
)

@Serializable
data class ParseResponse(
    val text: String? = null,
    val chips: List<ParseChipDto> = emptyList(),
    val source: String? = null,
    val error: String? = null,
)
