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

rootProject.name = "aiimin-v3"

// Modules are added as the screen that needs them is built (guardrail G1 —
// one surface at a time; no speculative scaffolding).
include(":app")
include(":core:designsystem")
include(":core:model")
include(":core:data")
include(":feature:capture")
include(":feature:today")
include(":feature:money")
include(":feature:config")
include(":feature:osid")
