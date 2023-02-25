import React, { useEffect, useState } from 'react';
import { GOOGLE_ACCESS_TOKEN } from '../contants';
import GoogleSpreadsheet from '../google-sheet/GoogleSpreadsheet';
import { getItem } from '../utility/localStorageControl';

function useGoogleSheet(spreadsheetId) {
  const doc = new GoogleSpreadsheet(spreadsheetId);
  const loadDoc = async () => {
    await doc.useRawAccessToken(localStorage.getItem('google_access_token'));
    await doc.loadInfo();
  };

  useEffect(() => {
    if (getItem(GOOGLE_ACCESS_TOKEN)) {
      loadDoc();
    }
  }, []);

  return doc;
}

export default useGoogleSheet;
