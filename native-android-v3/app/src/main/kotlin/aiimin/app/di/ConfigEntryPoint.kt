package aiimin.app.di

import aiimin.core.data.ConfigStore
import aiimin.core.data.knock.KnockStore
import dagger.hilt.EntryPoint
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent

@EntryPoint
@InstallIn(SingletonComponent::class)
interface ConfigEntryPoint {
    fun configStore(): ConfigStore
    fun knockStore(): KnockStore
}
