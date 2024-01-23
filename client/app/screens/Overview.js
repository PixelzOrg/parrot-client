import {
  StyleSheet,
  SafeAreaView,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  ImageBackground,
  Pressable,
  FlatList,
  SectionList,
} from "react-native";
import PieChart from "react-native-pie-chart";
import Container from "../components/Container";
import { useEffect, useState } from "react";
import {
  addNewDBMemory,
  getCategoryDistribution,
  getSQLDailySummary,
  getSocialDistribution,
  getTimeSpentPerCategory,
  getTimeSpentSocial,
  returnAllMemoriesFromDB,
} from "../scripts/Database";
import Memory, { categoryColor } from "../components/Memories/Memory";
import PickDayButton from "../components/PickDayButton";
import Memories from "./Memories";
import { FontAwesome, MaterialIcons, FontAwesome6 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import CategoryChart from "../components/Overview/CategoryChart";
import moment from "moment";
import DailySummary from "../components/Overview/DailySummary";
import { getVisibility } from "../scripts/Tools";
import PagerView from "react-native-pager-view";

export default function Overview({ navigation }) {
  const widthAndHeightLarge = 150;
  const widthAndHeightSmall = widthAndHeightLarge / 1.25;
  const [displayChart, setDisplayChart] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [daySummary, setDaySummary] = useState(
    "Record or upload memories for today to update your Daily Summary."
  );
  const [dailySumDisplay, setDailySumDisplay] = useState(
    <DailySummary summary={daySummary} />
  );
  const [files, setFiles] = useState([
    /* <Memory
      title="Practiced Yoga near a Pool"
      category="Relaxation & Leisure"
      timeStart="12:39"
      timeEnd="1:14"
      date=""
      summary=""
      location=""
      videoURI=""
      transcript=""
      latitude=""
      longitude=""
      social=""
    />,
    <Memory
      title="Walk in Park with Mom"
      category="Family"
      timeStart="12:11"
      timeEnd="12:39"
      date=""
      summary=""
      location=""
      videoURI=""
      transcript=""
      latitude=""
      longitude=""
      social=""
    />,
    <Memory
      title="Worked in Bedroom on Laptop Worked in Bedroom on Laptop Worked in Bedroom on Laptop"
      category="Work"
      timeStart="9:11"
      timeEnd="10:21"
      date=""
      summary=""
      location=""
      videoURI=""
      transcript=""
      latitude=""
      longitude=""
      social=""
    />,*/
  ]);
  const [piDistributions, setPiDistributions] = useState([/*1, 4, 1.1*/ 1]);
  const [piColors, setPiColors] = useState([
    "white",
    /*
    categoryColor("Family"),
    categoryColor("Work"),
    categoryColor("Relaxation & Leisure"),
    */
  ]);
  const [categoryPiChart, setCategoryPiChart] = useState(
    <PieChart
      widthAndHeight={widthAndHeightLarge}
      series={piDistributions}
      sliceColor={piColors}
      coverRadius={0.9}
      style={{
        position: "absolute",
      }}
    />
  );
  const [socialPiChart, setSocialPiChart] = useState(
    <PieChart
      widthAndHeight={widthAndHeightSmall}
      series={piDistributions}
      sliceColor={piColors}
      coverRadius={0.86}
      style={{
        position: "absolute",
      }}
    />
  );
  const { navigate } = useNavigation();
  //async function createCategoryChart

  async function createPiChart() {
    let categories = JSON.parse(await getTimeSpentPerCategory());
    //console.log(categories);
    let newCategoryPiColors = [];
    let newCategoryPiDistribution = [];
    categories.forEach((item) => {
      let newColor = categoryColor(item.category);
      newCategoryPiColors = [...newCategoryPiColors, newColor];
      newCategoryPiDistribution = [...newCategoryPiDistribution, item.minutes];
    });
    /*
    //Code for showing how much of Day wasn't recorded
    let categorySum = newCategoryPiDistribution.reduce(
      (acc, current) => acc + current,
      0
    );
    newCategoryPiColors = [...newCategoryPiColors, "white"];
    
    newCategoryPiDistribution = [
      ...newCategoryPiDistribution,
      1440 - categorySum,
    ];
    */

    if (newCategoryPiColors < 1) newCategoryPiColors = ["white"];
    if (newCategoryPiDistribution < 1) newCategoryPiDistribution = [1];

    let socials = JSON.parse(await getTimeSpentSocial());
    //console.log(socials);
    let newSocialsPiColors = [];
    let newSocialsPiDistribution = [];
    socials.forEach((item) => {
      let newColor = categoryColor(item.social);
      newSocialsPiColors = [...newSocialsPiColors, newColor];
      newSocialsPiDistribution = [...newSocialsPiDistribution, item.minutes];
    });

    //Code for showing how much of Day wasn't recorded
    /*
    let socialsSum = newSocialsPiDistribution.reduce(
      (acc, current) => acc + current,
      0
    );
    newSocialsPiDistribution = [...newSocialsPiDistribution, socialsSum];
    newSocialsPiColors = [...newSocialsPiColors, "white"];
    */

    if (newSocialsPiColors < 1) newSocialsPiColors = ["white"];
    if (newSocialsPiDistribution < 1) newSocialsPiDistribution = [1];

    //console.log(displayChart);

    setCategoryPiChart(
      <PieChart
        widthAndHeight={widthAndHeightLarge}
        series={newCategoryPiDistribution}
        sliceColor={newCategoryPiColors}
        coverRadius={0.9}
        style={{
          position: "absolute",
        }}
      />
    );

    setSocialPiChart(
      <PieChart
        widthAndHeight={widthAndHeightSmall}
        series={newSocialsPiDistribution}
        sliceColor={newSocialsPiColors}
        coverRadius={0.86}
        style={{
          position: "absolute",
        }}
      />
    );
  }

  useEffect(() => {
    navigation.addListener("focus", () => {
      updateOverview();
    });

    /*addNewDBMemory({
      title:
        "Worked in Bedroom on Laptop Worked in Bedroom on Laptop Worked in Bedroom on Laptop",
      category: "Work",
      timeStart: "9:11",
      timeEnd: "10:21",
      date: moment(new Date()).format("YYYY-MM-DD"),
      summary: "",
      location: "",
      videoURI: "",
      transcript: "",
      latitude: "",
      longitude: "",
      social: "Friends",
    });*/
  });

  async function setDailySummary() {
    let summary = await getSQLDailySummary();
    //console.log(summary);
    //setDaySummary(summary != null ? )
    setDailySumDisplay(
      <DailySummary
        summary={summary.length != 0 ? summary[0].daysummary : daySummary}
      />
    );
  }

  async function updateOverview() {
    setFiles(await showAllMemoriesFromDB());
    createPiChart();
    setIsProcessing(await getVisibility("processing-memory"));
    //console.log(await getTimeSpentSocial());
    setDailySummary();
  }

  async function bothOnClick() {
    setDisplayChart(!displayChart);
    //console.log(displayChart);
    createPiChart();
  }

  return (
    <ScrollView
      style={{
        backgroundColor: "#121212",
      }}
    >
      <View
        style={{
          flex: 1,
          marginTop: 60,
          backgroundColor: "#121212",
          marginBottom: 20,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-evenly",
          }}
        >
          <TouchableOpacity
            style={{
              width: 50,
              height: 50,
              backgroundColor: "#181818",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 25,
            }}
            onPress={() => {
              navigate("Profile", {});
            }}
          >
            <FontAwesome name="user" size={24} color="#FFF" />
          </TouchableOpacity>
          <View style={{ alignItems: "center" }}>
            <PickDayButton otherOnChange={updateOverview} />
          </View>
          <TouchableOpacity
            style={{
              width: 50,
              height: 50,
              backgroundColor: "#181818",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 25,
            }}
            onPress={() => {
              navigate("Settings", {});
            }}
          >
            <FontAwesome name="cog" size={30} color="#FFF" />
          </TouchableOpacity>
        </View>
        <View
          style={{
            marginVertical: 10,
            width: "auto",
            height: "auto",
          }}
        >
          <Pressable onPress={bothOnClick}>
            <View
              style={{
                height: widthAndHeightLarge,
                width: "100%",
                justifyContent: "center",
                position: "absolute",
              }}
            >
              <Image
                style={{
                  alignSelf: "center",
                  alignContent: "center",
                  height: widthAndHeightLarge / 3,
                  width: widthAndHeightLarge / 3,
                }}
                source={require("../assets/logoDark.png")}
              />
            </View>
            <View
              style={{
                width: "100%",
                height: widthAndHeightLarge,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {categoryPiChart}
              {socialPiChart}
            </View>
          </Pressable>
        </View>
        {displayChart && <PagerViewChart />}
        <View
          style={{
            flex: 1,
            marginBottom: 20,
            marginHorizontal: 10,
          }}
        >
          {dailySumDisplay}
        </View>
        <View>
          {isProcessing && (
            <Memory
              title="Processing"
              category="Processing"
              disabled="true"
              timeStart="00:00"
              timeEnd="00:00"
              date=""
              summary=""
              location=""
              videoURI=""
              transcript=""
              latitude=""
              longitude=""
              social="Processing"
            />
          )}
          {files && (
            <FlatList
              data={files}
              renderItem={({ item }) => {
                return item;
              }}
              scrollEnabled={false}
            />
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    margin: 10,
  },
  categories: {
    flexDirection: "column",
  },
  categoryText: {
    fontSize: 11,
    color: "white",
  },
});

function CategoryEntireChart() {
  return (
    <View
      style={{
        justifyContent: "space-between",
        flexDirection: "row",
      }}
    >
      <View style={styles.categories}>
        <CategoryChart category="Family" />
        <CategoryChart category="Friends" />
        <CategoryChart category="Dating/Partner" />
      </View>
      <View style={styles.categories}>
        <CategoryChart category="School" />
        <CategoryChart category="Work" />
        <CategoryChart category="Productive" />
      </View>
      <View style={styles.categories}>
        <CategoryChart category="Hobbies & Skills" />
        <CategoryChart category="Relaxation & Leisure" />
        <CategoryChart category="Health & Travel" />
      </View>
      <View style={styles.categories}>
        <CategoryChart category="Sleep" />
        <CategoryChart category="Waste" />
        <CategoryChart category="Not Recorded" />
      </View>
    </View>
  );
}

function PagerViewChart() {
  return (
    <PagerView
      initialPage={0}
      style={{
        marginVertical: 10,
        height: 50,
        width: "100%",
        justifyContent: "center",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
        }}
        key="0"
      >
        <CategoryChart category="Family" />
        <CategoryChart category="Friends" />
        <CategoryChart category="Dating/Partner" />
      </View>
      <View key="1">
        <View style={styles.categories}>
          <CategoryChart category="School" />
          <CategoryChart category="Work" />
          <CategoryChart category="Productive" />
        </View>
        <View style={styles.categories}>
          <CategoryChart category="Hobbies & Skills" />
          <CategoryChart category="Relaxation & Leisure" />
          <CategoryChart category="Health & Travel" />
        </View>
        <View style={styles.categories}>
          <CategoryChart category="Sleep" />
          <CategoryChart category="Waste" />
          <CategoryChart category="Not Recorded" />
        </View>
      </View>
    </PagerView>
  );
}

async function showAllMemoriesFromDB() {
  //console.log("peepee");
  let memories = await returnAllMemoriesFromDB();
  let dbMemories = [];
  memories.forEach((item) => {
    //console.log(item.id);
    dbMemories = [
      ...dbMemories,
      <Memory
        title={item.title}
        category={item.category}
        timeStart={item.timeStart}
        timeEnd={item.timeEnd}
        date={item.date}
        summary={item.summary}
        location={item.location}
        videoURI={item.videoURI}
        transcript={item.transcript}
        latitude={item.latitude}
        longitude={item.longitude}
        social={item.social}
      />,
    ];
  });
  return dbMemories;
}
