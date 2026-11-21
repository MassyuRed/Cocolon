import React, { useEffect, useState } from "react";
import { AppState } from "react-native";
import CocolonScreenIntro from "../../components/CocolonScreenIntro";

const weekdays = ["日", "月", "火", "水", "木", "金", "土"];

function formatLocalDate(date) {
  return `${date.getMonth() + 1}月${date.getDate()}日 ${weekdays[date.getDay()]}曜日`;
}

export default function HomeScreenIntro({ colors, ui }) {
  const [dateLabel, setDateLabel] = useState(() => formatLocalDate(new Date()));

  useEffect(() => {
    let timer;
    const refresh = () => {
      const now = new Date();
      const nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      setDateLabel(formatLocalDate(now));
      timer = setTimeout(refresh, nextMidnight.getTime() - now.getTime());
    };
    const subscription = AppState.addEventListener("change", state => {
      clearTimeout(timer);
      if (state === "active") refresh();
    });
    refresh();
    return () => {
      clearTimeout(timer);
      subscription.remove();
    };
  }, []);

  return (
    <CocolonScreenIntro
      eyebrow={dateLabel}
      title="今のあなたを、言葉に。"
      description="まとまっていなくても、そのままで。"
      colors={colors}
      ui={ui}
    />
  );
}
