import React, { useCallback } from "react";
import { Button, ScrollView, ButtonGroup, View } from "native-base";
import { isEqual } from "lodash";

export default function ({ options, value, onChange }) {
  const itemColor = useCallback(
    (status) => {
      return isEqual(status, value) ? "accent" : "brand";
    },
    [value]
  );

  const itemRounded = useCallback(
    (status) => {
      return isEqual(status, value) ? "sm" : "full";
    },
    [value]
  );

  return (
    <View style={{flexDirection: "row", maxWidth: "100%", flex: 1, flexWrap: 'wrap'}} 
    my={1}>
      {options.map((option, i) => {
        return (
          <Button
            key={i}
            mx={1}
            my={1}
            colorScheme={itemColor(option.value)}
            rounded={itemRounded(option.value)}
            onPress={() => onChange(option.value)}
          >
            {option.title}
          </Button>
        );
      })}
    </View>
  );
}
