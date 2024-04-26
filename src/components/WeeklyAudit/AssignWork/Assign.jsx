import React from 'react';
import logoImage from '../../../Assets/header/bitFullLogo.png';
import {
 Document,
 Page,
 Text,
 View,
 StyleSheet,
 Image,
} from '@react-pdf/renderer';

const styles = StyleSheet.create({
 page: {
    padding: 30,
 },
 header: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 30,
 },
 table: {
    display: 'table',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
 },
 tableRow: {
    flexDirection: 'row',
    borderBottomColor: '#bbb',
    borderBottomWidth: 1,
    alignItems: 'center',
    height: 24,
    fontSize: 10,
 },
 tableCol: {
    width: '20%',
    borderLeftColor: '#bbb',
    borderLeftWidth: 1,
    borderTopColor: '#bbb',
    borderTopWidth: 1,
    padding: 5,
 },
 tableCell: {
    flexGrow: 1,
    textAlign: 'center',
 },
 // Additional styles to match your CSS
 th: {
    backgroundColor: '#f2f2f2',
    textAlign: 'left',
 },
 td: {
    border: '1px solid #ddd',
    padding: 8,
 },
 input: {
    width: '100%',
    boxSizing: 'border-box',
    marginBottom: 10,
 },
 form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
 },
 button: {
    padding: 10,
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: 5,
    cursor: 'pointer',
 },
 buttonHover: {
    backgroundColor: '#0056b3',
 },
});


const TasksPDFDocument = ({ tasks }) => (
 <Document>
    <Page size="A4" orientation="landscape" style={styles.page}>
    <Image style={styles.image} src={logoImage} />
      <Text style={styles.header}>Tasks Report</Text>
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>Serial Number</Text>
          <Text style={styles.tableCell}>Audit Date</Text>
          <Text style={styles.tableCell}>Task ID</Text>
          <Text style={styles.tableCell}>Audit Area</Text>
          <Text style={styles.tableCell}>Specific Area</Text>
          <Text style={styles.tableCell}>Report Observation</Text>
          <Text style={styles.tableCell}>Remarks</Text>
          <Text style={styles.tableCell}>Suggestions</Text>
          <Text style={styles.tableCell}>Specific Task ID</Text>
          <Text style={styles.tableCell}>Action Taken</Text>
          <Text style={styles.tableCell}>Progress</Text>
        </View>
        {tasks.map((task, index) => (
          <View key={task.task_id_specific} style={styles.tableRow}>
            <Text style={styles.tableCell}>{index + 1}</Text>
            <Text style={styles.tableCell}>{task.date}</Text>
            <Text style={styles.tableCell}>{task.task_id}</Text>
            <Text style={styles.tableCell}>{task.audit_area}</Text>
            <Text style={styles.tableCell}>{task.specific_area}</Text>
            <Text style={styles.tableCell}>{task.report_observation}</Text>
            <Text style={styles.tableCell}>{task.remarks}</Text>
            <Text style={styles.tableCell}>{task.suggestions}</Text>
            <Text style={styles.tableCell}>{task.task_id_specific}</Text>
            <Text style={styles.tableCell}>{task.action_taken}</Text>
            <Text style={styles.tableCell}>{task.progress}</Text>
          </View>
        ))}
      </View>
    </Page>
 </Document>
);

export default TasksPDFDocument;
