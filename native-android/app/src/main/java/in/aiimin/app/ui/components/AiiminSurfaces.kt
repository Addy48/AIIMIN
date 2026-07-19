package `in`.aiimin.app.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp

@Composable
fun AiiminCard(
    modifier: Modifier = Modifier,
    elevation: Dp = 6.dp,
    containerColor: Color = MaterialTheme.colorScheme.surface,
    content: @Composable ColumnScope.() -> Unit,
) {
    Surface(
        modifier = modifier
            .fillMaxWidth()
            .shadow(elevation, RoundedCornerShape(20.dp), ambientColor = Color(0x1AFF6B35), spotColor = Color(0x33FF6B35))
            .background(containerColor, RoundedCornerShape(20.dp)),
        color = containerColor,
        shape = RoundedCornerShape(20.dp),
    ) {
        Column(Modifier.padding(20.dp), content = content)
    }
}

@Composable
fun AiiminSectionTitle(title: String, subtitle: String? = null, modifier: Modifier = Modifier) {
    Column(modifier = modifier.padding(bottom = 4.dp)) {
        androidx.compose.material3.Text(title, style = MaterialTheme.typography.titleLarge)
        subtitle?.let {
            androidx.compose.material3.Text(
                it,
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
            )
        }
    }
}
