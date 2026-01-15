
import { useState } from "react";
import {View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from "react-native";

<Image source={require("../../assets/images/avatar.jpg")} />



export default function SettingsScreen() {
  const [isDark, setIsDark] = useState(false);
  const backgroundColor = isDark ? "#121212" : "#FFFFFF";
  const textColor = isDark ? "#FFFFFF" : "#000000";


  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor}]}>
      <View style={styles.userBox}>
        <Image
         source={require("../../assets/images/avatar.jpg")}
         style={styles.avatar}
        />
        <Text style={[styles.sectionTitle, { color: textColor }]}>Testi Teppo</Text>
        <Text style={styles.userEmail}>testi@teppo.fi</Text>
      </View>



      <Text style={[styles.sectionTitle, { color: textColor }]}>Account</Text>
      <View style={styles.sectionBox}>
        <SettingsItem label="Change password" textColor={textColor}/>
        <SettingsItem label="Log out"textColor={textColor} />
        <SettingsItem label="Delete account" danger textColor={textColor} />
      </View>


      <Text style={[styles.sectionTitle, { color: textColor }]}>Preferences</Text>
      <View style={styles.sectionBox}>
        <SettingsItem label="Language"textColor={textColor} />
        <SettingsItem
          label={`Dark mode: ${isDark ? "On" : "Off"}`}
         onPress={() => setIsDark(!isDark)}
        textColor={textColor}/>
        <SettingsItem label="Font size" textColor={textColor} />
      </View>


      <Text style={[styles.sectionTitle, { color: textColor }]}>Storage</Text>
      <View style={styles.sectionBox}>
        <SettingsItem label="Used space" textColor={textColor}/>
        <SettingsItem label="Clear cache" textColor={textColor}/>
      </View>


      <Text style={[styles.sectionTitle, { color: textColor }]}>Calculator</Text>
      <View style={styles.sectionBox}>
        <SettingsItem label="Precision" textColor={textColor}/>
      </View>


      <Text style={[styles.sectionTitle, { color: textColor }]}>About</Text>
      <View style={styles.sectionBox}>
        <SettingsItem label="Version" textColor={textColor}/>
        <SettingsItem label="Privacy policy" textColor={textColor} />
      </View>


      <Text style={[styles.sectionTitle, { color: textColor }]}>PRO+</Text>
      <View style={styles.sectionBox}>
        <SettingsItem label="Upgrade to Pro" pro textColor={textColor}/>
      </View>
    </ScrollView>
  );
}



function SettingsItem({
  label,
  danger,
  pro,
  onPress,
  textColor, 
}: {
  label: string;
  danger?: boolean;
  pro?: boolean;
  onPress?: () => void;
  textColor: string;
}) {
  return (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <Text
        style={[
          styles.itemText,
          {color: textColor},
          danger && { color: "#D32F2F" },
          pro && { fontWeight: "bold" },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}



const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#FFFFFF",
  },

  userBox: {
    alignItems: "center",
    marginBottom: 24,
  },
avatar: {
  width: 64,
  height: 64,
  borderRadius: 32,
  marginBottom: 8,
},

  userName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  userEmail: {
    fontSize: 14,
    color: "#666666",
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 6,
    color: "#555555",
  },

  sectionBox: {
    borderWidth: 1,
    borderColor: "#DDDDDD",
  },

  item: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#DDDDDD",
  },

  itemText: {
    fontSize: 16,
  },
});
