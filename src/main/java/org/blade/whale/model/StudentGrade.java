package org.blade.whale.model;

import org.blade.whale.ImportException;

public enum StudentGrade {
	XIAOBAN(0), ZHONGBAN(1), DABAN(2), XIAOYI(3), XIAOER(4), XIAOSAN(5), XIAOSI(
			6), XIAOWU(7), XIAOLIU(8), CHUYI(9), CHUER(10), CHUSAN(11), GAOYI(
			12), GAOER(13), GAOSAN(14);

	private int grade;

	private StudentGrade(int grade) {
		this.grade = grade;
	}

	public int getIntValue() {
		return this.grade;
	}

	public static StudentGrade parse(String input) throws ImportException {
		StudentGrade result = null;
		if (input == null) {
			return null;
		} else if (input.equals("小班")) {
			result = StudentGrade.XIAOBAN;
		} else if (input.equals("中班")) {
			result = StudentGrade.ZHONGBAN;
		} else if (input.equals("大班")) {
			result = StudentGrade.DABAN;
		} else if (input.equals("小学一年级")||input.equals("一年级")||input.equals("小一")) {
			result = StudentGrade.XIAOYI;
		} else if (input.equals("小学二年级")||input.equals("二年级")||input.equals("小二")) {
			result = StudentGrade.XIAOER;
		} else if (input.equals("小学三年级")||input.equals("三年级")||input.equals("小三")) {
			result = StudentGrade.XIAOSAN;
		} else if (input.equals("小学四年级")||input.equals("四年级")||input.equals("小四")) {
			result = StudentGrade.XIAOSI;
		} else if (input.equals("小学五年级")||input.equals("五年级")||input.equals("小五")) {
			result = StudentGrade.XIAOWU;
		} else if (input.equals("小学六年级")||input.equals("六年级")||input.equals("小六")) {
			result = StudentGrade.XIAOLIU;
		} else if (input.equals("初中一年级")||input.equals("七年级")||input.equals("初一")) {
			result = StudentGrade.CHUYI;
		} else if (input.equals("初中二年级")||input.equals("八年级")||input.equals("初二")) {
			result = StudentGrade.CHUER;
		} else if (input.equals("初中三年级")||input.equals("九年级")||input.equals("初三")) {
			result = StudentGrade.CHUSAN;
		} else if (input.equals("高中一年级")||input.equals("高一")) {
			result = StudentGrade.GAOYI;
		} else if (input.equals("高中二年级")||input.equals("高二")) {
			result = StudentGrade.GAOER;
		} else if (input.equals("高中三年级")||input.equals("高三")) {
			result = StudentGrade.GAOSAN;
		} else {
			throw new ImportException("无法将[" + input + "]解析为子女就读年级");
		}
		return result;
	}
}
