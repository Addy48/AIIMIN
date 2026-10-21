package aiimin.core.nlp

import com.google.common.truth.Truth.assertThat
import java.time.LocalDate
import org.junit.Test

/** PRD Part 5 Phase 1: a version carries its own start and provider. */
class DocumentStartTest {
    @Test fun `period of insurance gives the start and the end`() {
        val f = DocumentFields.extract("ICICI Lombard General Insurance. Period of Insurance: From 14/10/2026 To 13/10/2027 Policy No: 3001/ABC/123")
        assertThat(f.starts).isEqualTo(LocalDate.of(2026, 10, 14))
        assertThat(f.provider).isEqualTo("ICICI Lombard")
    }

    @Test fun `valid from and commencement read as the start`() {
        assertThat(DocumentFields.extract("Valid from 01 Nov 2026 valid till 31 Oct 2027").starts).isEqualTo(LocalDate.of(2026, 11, 1))
        assertThat(DocumentFields.extract("Date of commencement: 05-01-2026").starts).isEqualTo(LocalDate.of(2026, 1, 5))
    }

    @Test fun `no cue, no start, no guessed provider`() {
        val f = DocumentFields.extract("Electricity bill for September 2026")
        assertThat(f.starts).isNull()
        assertThat(f.provider).isNull()
    }

    @Test fun `known insurers are named the same way whatever the case`() {
        assertThat(DocumentFields.extract("HDFC ERGO General Insurance Company").provider).isEqualTo("HDFC Ergo")
        assertThat(DocumentFields.extract("Care Health Insurance Ltd").provider).isEqualTo("Care Health")
        assertThat(DocumentFields.extract("Star Health and Allied Insurance").provider).isEqualTo("Star Health")
    }
}
