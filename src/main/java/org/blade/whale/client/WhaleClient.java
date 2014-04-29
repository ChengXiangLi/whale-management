package org.blade.whale.client;

import org.apache.commons.cli.CommandLine;
import org.apache.commons.cli.CommandLineParser;
import org.apache.commons.cli.HelpFormatter;
import org.apache.commons.cli.Options;
import org.apache.commons.cli.PosixParser;
import org.blade.whale.dataexport.DataExport;
import org.blade.whale.dataimport.DataImport;

public class WhaleClient {

	public static void main(String[] args) {
		Options options = new Options();
		options.addOption("type", true, "import or export");
		options.addOption("table", true, "table name, person or company.");
		options.addOption("importPath", true, "import excel file path");
		options.addOption("querySql", true, "query sql");
		options.addOption("exportPath", true, "export excel file path");
		CommandLineParser parser = new PosixParser();
		try {
			CommandLine cmd = parser.parse(options, args);
			String type = cmd.getOptionValue("type");
			String table = cmd.getOptionValue("table");
			if (type.equalsIgnoreCase("import")) {
				if (cmd.hasOption("importPath")) {
					String importPath = cmd.getOptionValue("importPath");
					DataImport.dataImport(importPath, table);
				} else {
					throw new Exception("you must implify importPath");
				}
			} else if (type.equalsIgnoreCase("export")) {
				if (cmd.hasOption("querySql")) {
					String querySql = cmd.getOptionValue("querySql");
					if (cmd.hasOption("exportPath")) {
						String exportPath = cmd.getOptionValue("exportPath");
						DataExport.exportData(table, querySql, exportPath);
					} else {
						throw new Exception("you must implify exportPath.");
					}
				} else {
					throw new Exception("you must implify querySql");
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
			HelpFormatter formatter = new HelpFormatter();
			formatter.printHelp("whale", options);
		}
	}
}
