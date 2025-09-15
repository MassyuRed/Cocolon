package com.anonymous.cocolonmvp

import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate

class MainActivity : ReactActivity() {
    // ハイフンを除去して名前を統一
    override fun getMainComponentName(): String = "cocolonmvp"

    override fun createReactActivityDelegate(): ReactActivityDelegate {
        return ReactActivityDelegate(this, mainComponentName)
    }
}


