import { NativeModules, Platform } from "react-native";
import Reactotron from "reactotron-react-native";
import { ArgType } from "reactotron-core-client"
import { router  } from "expo-router"

const reactotron = Reactotron.configure({
  name: 'StickerSmash',
})
  .useReactNative()

  if (Platform.OS !== "web") {
    reactotron.useReactNative({
      networking: {
        ignoreUrls: /symbolicate/,
      },
    })
  }

  reactotron.onCustomCommand({
    title: "Show Dev Menu",
    description: "Opens the React Native dev menu",
    command: "showDevMenu",
    handler: () => {
      Reactotron.log("Showing React Native dev menu")
      NativeModules.DevMenu.show()
    },
  })

  reactotron.onCustomCommand<[{ name: "route"; type: ArgType.String }]>({
    command: "navigateTo",
    handler: (args) => {
      const { route } = args ?? {}
      if (route) {
        Reactotron.log(`Navigating to: ${route}`)
        router.replace(route as any) // this should be tied to the navigator, but since this is for debugging, we can navigate to illegal routes
      } else {
        Reactotron.log("Could not navigate. No route provided.")
      }
    },
    title: "Navigate To Screen",
    description: "Navigates to a screen by name.",
    args: [{ name: "route", type: ArgType.String }],
  })

  /**
 * We're going to add `console.tron` to the Reactotron object.
 * Now, anywhere in our app in development, we can use Reactotron like so:
 *
 * ```
 * if (__DEV__) {
 *  console.tron.display({
 *    name: 'JOKE',
 *    preview: 'What's the best thing about Switzerland?',
 *    value: 'I don't know, but the flag is a big plus!',
 *    important: true
 *  })
 * }
 * ```
 *
 * Use this power responsibly! :)
 */
console.tron = Reactotron

/**
 * We tell typescript about our dark magic
 *
 * You can also import Reactotron yourself from ./reactotronClient
 * and use it directly, like Reactotron.log('hello world')
 */
declare global {
  interface Console {
    /**
     * Reactotron client for logging, displaying, measuring performance, and more.
     * @see https://github.com/infinitered/reactotron
     * @example
     * if (__DEV__) {
     *  console.tron.display({
     *    name: 'JOKE',
     *    preview: 'What's the best thing about Switzerland?',
     *    value: 'I don't know, but the flag is a big plus!',
     *    important: true
     *  })
     * }
     */
    tron: typeof reactotron
  }
}

reactotron.connect()