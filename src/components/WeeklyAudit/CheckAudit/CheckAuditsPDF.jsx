import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
 page: {
    flexDirection: 'row',
    backgroundColor: '#E4E4E4'
 },
 section: {
    margin: 10,
    padding: 10,
    flexGrow: 1
 }
});

const CheckAuditsPDF = ({ auditsData, date, taskId }) => (
 <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text>Audit Date: {date}</Text>
        <Text>Task ID: {taskId}</Text>
        {auditsData.map((audit, index) => (
          <View key={index}>
            <Text>Audit Area: {audit.area_name}</Text>
            <Text>Specific Area: {audit.area_gender}</Text>
            <Text>Report Observation: {audit.reportObservation}</Text>
            <Text>Remarks: {audit.remarks}</Text>
            <Text>Suggestions: {audit.suggestions}</Text>
          </View>
        ))}
      </View>
    </Page>
 </Document>
);

export default CheckAuditsPDF;
