pluginManagement {
    includeBuild("build-logic")
    repositories {
        google {
            content {
                includeGroupByRegex("com\\.android.*")
                includeGroupByRegex("com\\.google.*")
                includeGroupByRegex("androidx.*")
            }
        }
        mavenCentral()
        gradlePluginPortal()
    }
}

dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google {
            content {
                includeGroupByRegex("com\\.android.*")
                includeGroupByRegex("com\\.google.*")
                includeGroupByRegex("androidx.*")
            }
        }
        mavenCentral()
    }
}

// `implementation(projects.core.designsystem)` instead of a stringly path.
enableFeaturePreview("TYPESAFE_PROJECT_ACCESSORS")

rootProject.name = "aiimin-v4"

// Modules are added as the screen that needs them is built (guardrail G1 —
// one surface at a time; no speculative scaffolding).
include(":app")
// Pure Kotlin — no Android on the classpath.
include(":core:engine")
include(":core:privacy")
include(":core:nlp")
include(":core:model")
// Android core.
include(":core:network")
include(":core:designsystem")
include(":core:database")
include(":core:sensing")
include(":core:data")
// Features — one per area of the dock.
include(":feature:today")
include(":feature:money")
include(":feature:vault")
include(":feature:me")
include(":feature:assistant")
include(":feature:notes")
include(":feature:onboarding")
