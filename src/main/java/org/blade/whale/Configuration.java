package org.blade.whale;

import java.io.File;
import java.io.FileReader;
import java.net.URL;
import java.util.Properties;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class Configuration {

	private static final Logger logger = LoggerFactory
			.getLogger(Configuration.class);
	private static String configFile = "config.properties";
	private static Properties properties;

	static {
		loadProperties();
	}

	private static void loadProperties() {
		properties = new Properties();
		try {
			URL url = Thread.currentThread().getContextClassLoader()
					.getResource(configFile);
			properties.load(new FileReader(new File(url.toURI())));
		} catch (Exception e) {
			logger.warn("Failed to load config file[{}].", configFile, e);
		}
	}

	public static String getProperty(String propertyName) {
		return properties.getProperty(propertyName);
	}

	public static String getDBUrl() {
		return properties.getProperty("db.url", "jdbc:mysql://localhost/whale?useUnicode=true&characterEncoding=UTF8");
	}
	
	public static String getMysqlUrl() {
		return properties.getProperty("mysql.url", "jdbc:mysql://localhost/?useUnicode=true&characterEncoding=UTF8");
	}

	public static String getDBUsername() {
		return properties.getProperty("db.username", "root");
	}

	public static String getDBPassword() {
		return properties.getProperty("db.password", "");
	}
}
