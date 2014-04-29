package org.blade.whale.dataimport;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

import org.blade.whale.ImportException;
import org.junit.Test;

public class DataImportTest {

	@Test
	public void test1() throws ImportException {
		DataImport.dataImport("D:/workspace/whale/src/test/resources/test-company.xls", "COMPANY");
	}	
	
	@Test
	public void test2() throws ImportException {
		DataImport.dataImport("D:/workspace/whale/src/test/resources/test-person.xls", "PERSON");
	}	
	
	@Test
	public void test3() {
		SimpleDateFormat sdf5 = new SimpleDateFormat("yyyy年MM月");
		try {
			Date date = sdf5.parse("2013年08月");
			System.out.println(date);
		} catch (ParseException e) {
			e.printStackTrace();
		}
	}
}
