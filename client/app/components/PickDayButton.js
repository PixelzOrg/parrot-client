import moment from "moment";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import {
  setDBDate,
  getDBCalendarDate,
  setDBCalendarDate,
} from "../scripts/Database";
import { useEffect, useState } from "react";
import { View } from "react-native";

export default function PickDayButton(props) {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    getDate();
  });

  const onDateChange = (e, selectedDate) => {
    setDate(selectedDate);
    setDBCalendarDate(selectedDate);
    setDBDate(moment(selectedDate).format("YYYY-MM-DD"));
    props.otherOnChange();
  };

  async function getDate() {
    let test = await getDBCalendarDate();
    setDate(test);
  }

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <RNDateTimePicker
        value={date}
        mode="date"
        is24Hour={true}
        onChange={onDateChange}
        display="default"
        themeVariant="dark"
        accentColor="white"
        style={{
          alignSelf: "center",
        }}
      />
    </View>
  );
}
