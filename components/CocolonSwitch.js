import React from "react";
import { Platform, Switch, View } from "react-native";

/**
 * CocolonSwitch
 * - iOS の Switch が OS アップデートでサイズ/形状が変わっても、配置ルールを一箇所で統一するためのラッパーです。
 * - 現状は「iOSだけ右端に寄りすぎる」問題の対処として、iOS時のみ右側に余白を入れて少し左へ寄せます。
 *
 * 使い方（例）:
 *   <CocolonSwitch value={on} onValueChange={setOn} />
 *
 * 画面ごとに微調整したい場合:
 *   <CocolonSwitch iosRightInset={16} />
 */
export default function CocolonSwitch({
  iosRightInset = 12,
  containerStyle,
  ...switchProps
}) {
  const extraRight = Platform.OS === "ios" ? Number(iosRightInset || 0) : 0;

  return (
    <View style={[{ marginRight: extraRight }, containerStyle]}>
      <Switch {...switchProps} />
    </View>
  );
}
