"use client";


const DownloadButton = ({ events }) => {

  const exportData = () => {

    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
      JSON.stringify(events)
    )}`;
    
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = "calendar.json";
    link.click();
  };

  return (
    <button onClick={exportData} className="button button__submit">
      Export Calendar
    </button>
  );
};

export default DownloadButton;
