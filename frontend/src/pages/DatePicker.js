import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';

function MyDatePicker() {
  const [selectedDate, setSelectedDate] = useState(null);

  const formatDate = (date) => {
    const temp=(format(date, 'EEE MMM dd yyyy HH:mm:ss \'GMT\'xxx (zzzz)'));
  };
  
  if(selectedDate){
    formatDate(selectedDate)
  }
  

  return (
    <div>
      <DatePicker
        selected={selectedDate}
        onChange={date => setSelectedDate(date)}
        showTimeSelect
        timeFormat="HH:mm"
        timeIntervals={15}
        dateFormat="MMMM d, yyyy h:mm aa"
        timeCaption="Time"
      />
    </div>
  );
}

export default MyDatePicker;