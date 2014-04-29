package org.blade.whale.dataimport;

import java.io.File;
import java.util.List;

import org.blade.whale.ExportException;
import org.blade.whale.dataexport.DataExport;
import org.junit.Test;

public class DataExportTest {

	@Test
	public void test() throws ExportException {
			String exportPath = "D:/workspace/whale/target/output.xls";
			File file = new File(exportPath);
			if (file.exists()) {
				file.delete();
			}
			DataExport.exportData("COMPANY", "法人单位名称, 注册资金, 注册时间, 法人手机号", null);
	}
	
	@Test
	public void test2() throws ExportException {
			List<List<String>> result = DataExport.queryData("COMPANY", "法人单位名称, 注册资金, 注册时间, 法人手机号", null);
			System.out.println(result);
	}
}
