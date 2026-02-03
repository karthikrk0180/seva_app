import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { VictoryPie, VictoryChart, VictoryTheme, VictoryBar } from 'victory-native';
import { COLORS, TYPOGRAPHY, SPACING } from 'src/theme';

interface ChartProps {
  data: { x: string; y: number }[];
  title?: string;
  type?: 'pie' | 'bar';
}

export const SimpleChart = ({ data, title, type = 'bar' }: ChartProps) => {
  return (
    <View style={styles.container}>
      {title && <Text style={[TYPOGRAPHY.h3, styles.title]}>{title}</Text>}
      
      {type === 'pie' ? (
        <VictoryPie
            data={data}
            colorScale={[COLORS.primary, COLORS.secondary, COLORS.accent, '#AAB']}
            width={300}
            height={300}
            style={{ labels: { fill: COLORS.text.primary, fontSize: 12 } }}
        />
      ) : (
        <VictoryChart width={320} theme={VictoryTheme.material}>
            <VictoryBar data={data} style={{ data: { fill: COLORS.primary } }} />
        </VictoryChart>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center', marginVertical: SPACING.m },
  title: { marginBottom: SPACING.s, textAlign: 'center' }
});
