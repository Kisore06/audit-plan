import {useState,useEffect,React} from 'react';
import {
 Document,
 Page,
 Text,
 View,
 StyleSheet,
} from '@react-pdf/renderer';
import { FlashOnRounded, Height } from '@mui/icons-material';

function formatDate(date) {
 const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
 return new Date(date).toLocaleDateString('en-US', options);
}
let rowheight= "20px"
const styles = StyleSheet.create({
 page: {
    padding: 30,
 },
 
 header: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 30,
 },
 details: {
    paddingTop: 90,
    flexDirection: 'column',
    alignItems: 'flex-start',
 },
 detailItem: {
    marginBottom: 10,
 },
 detailFlex: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
 },
 table: {
    display: 'table',
    width: '100%',
 },

 tableRow: {
    flexDirection: 'row',
    height:rowheight,
    width:"100%",
    fontSize: 10,
 },
 tableCell: {
    textAlign: 'center',
    borderColor: '#000',
    borderWidth: 1,
    width:"500px",
    fontSize: 10,
    
 },

});

const TasksPDFDocument = ({ tasks, startDate, endDate, TasksCount, completedTasksCount, pendingTasksCount }) => {
 // Group tasks by audit area and specific area to handle row spans
 let serialNumber = 1;
 var duplicateTasksChecked = false
 const groupedTasks = tasks.reduce((acc, task) => {
    if (!acc[task.audit_area]) {
      acc[task.audit_area] = {
        specificAreas: {},
        serialNumber: 1,
      };
    }
    if (!acc[task.audit_area].specificAreas[task.specific_area]) {
      acc[task.audit_area].specificAreas[task.specific_area] = [];
    }
    acc[task.audit_area].specificAreas[task.specific_area].push(task);
    return acc;
 }, {});
var taskValArr =  tasks.map((item)=>item.audit_area)
var duplicateTasks = []
if(duplicateTasksChecked===false){
  checkDuplicates(taskValArr)
}

function checkDuplicates(arr){
  console.log("Oh my god")
  for(let i=0;i<arr.length;i++){
    for(let j=i+1;j<arr.length;j++){
      if(arr[i]===arr[j]){
        duplicateTasks.push({i,j})
      }
    }
}
duplicateTasksChecked=true
}

console.log(duplicateTasks)

function findIfIndexIsDuplicate(index){
  console.log("Im called yay "+ index)
  for(let i=0;i<duplicateTasks.length;i++){
    if(index===duplicateTasks[i].i){
      return ({dup:true,i})
    }
  }
  return ({dup:false})
}


 return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <Text style={styles.header}>Tasks Report</Text>
        <View style={styles.details}>
          <Text style={styles.detailItem}>Tasks for {formatDate(startDate)} to {formatDate(endDate)}</Text>
          <View style={styles.detailFlex}>
            <Text>Number of Tasks: {TasksCount}</Text>
            <Text>Completed Tasks: {completedTasksCount}</Text>
            <Text>Pending Tasks: {pendingTasksCount}</Text>
          </View>
        </View>
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
          
          
                {   
                    tasks.map((data,index)=>{
                      if(!findIfIndexIsDuplicate(index).dup){
                        return(
                          <View style={styles.tableRow}>
                       
                          <Text style={styles.tableCell}>{serialNumber++}</Text> 
                       <Text style={styles.tableCell}>
                        <View style={styles.tableRow}>
                          <Text style={styles.tableCell}>
                            Heidekediedie
                          </Text>
                        </View>
                        <View style={styles.tableRow}>
                          <Text style={styles.tableCell}>
                            Heidekediedie
                          </Text>
                        </View>
                        </Text> 
                      <Text style={styles.tableCell}>{data.task_id}</Text> 
                       <Text style={styles.tableCell}>{data.audit_area}</Text> 
                      <Text style={styles.tableCell}>{data.specific_area}</Text> 
                       <Text style={styles.tableCell}>{data.report_observation}</Text> 
                       <Text style={styles.tableCell}>{data.remarks}</Text> 
                       <Text style={styles.tableCell}>{data.suggestions}</Text> 
                       <Text style={styles.tableCell}>{data.task_id_specific}</Text> 
                       <Text style={styles.tableCell}>{data.action_taken}</Text> 
                       <Text style={styles.tableCell}>{data.progress}</Text> 
                       </View>
                        )
                      }
                      else{
                       
                        return(
                          <View  style={{flexDirection: 'row',
                          width:"100%",
                          height:rowheight*2,
                          fontSize: 10}}>
                       
                          <Text style={styles.tableCell}>{serialNumber++}</Text> 
                       <Text style={styles.tableCell}>{data.date}</Text> 
                      <Text style={styles.tableCell}>{data.task_id}</Text> 
                       <Text style={styles.tableCell}>{data.audit_area}</Text> 
                      <Text style={styles.tableCell}>{data.specific_area}</Text> 
                       <Text style={styles.tableCell}>{data.report_observation}</Text> 
                       <Text style={styles.tableCell}>{data.remarks}</Text> 
                       <Text style={styles.tableCell}>{data.suggestions}</Text> 
                       <Text style={styles.tableCell}>{data.task_id_specific}</Text> 
                       <Text style={styles.tableCell}>{data.action_taken}</Text> 
                       <Text style={styles.tableCell}>{data.progress}</Text> 
                       </View>
                        )
                      }
                     
                  
             
                  
                  
})
                   
                }
                {
                  console.log(tasks)
                }
         


         
        </View>
      </Page>
    </Document>
 );
};

export default TasksPDFDocument;
