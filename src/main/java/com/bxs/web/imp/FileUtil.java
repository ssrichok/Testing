package com.bxs.web.imp;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.FilenameFilter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;

public class FileUtil {

    public enum SortBy {
	Filename, ModifiedTime
    }

    public enum SortDirection {
	ASC, DESC
    }

    class FilenameComparator implements Comparator<File> {
	private SortDirection direction;

	public FilenameComparator(SortDirection direction) {
	    this.direction = direction;
	}

	@Override
	public int compare(File left, File right) {
	    if (direction == SortDirection.DESC)
		return right.getName().compareTo(left.getName());
	    return left.getName().compareTo(right.getName());
	}

    }

    class FileLastmodifiedComparator implements Comparator<File> {
	private SortDirection direction;

	public FileLastmodifiedComparator(SortDirection direction) {
	    this.direction = direction;
	}

	@Override
	public int compare(File left, File right) {
	    if (direction == SortDirection.DESC) {
		return Long.valueOf(right.lastModified()).compareTo(left.lastModified());

	    }
	    return Long.valueOf(left.lastModified()).compareTo(right.lastModified());
	}
    }

    public static List<String> getFileList(final String path) {
	return getFileList(path, ".*", SortBy.Filename, SortDirection.ASC);
    }

    public static List<String> getFileList(final String path, final String filenamePattern) {
	return getFileList(path, filenamePattern, SortBy.Filename, SortDirection.ASC);
    }

    public static List<String> getFileList(final String path, final String filenamePattern, SortBy sortBy, SortDirection sortDirection) {
	List<String> resultList = new ArrayList<String>();
	FilenameFilter filter = new FilenameFilter() {
	    @Override
	    public boolean accept(File dir, String name) {
		return name.matches(filenamePattern);
	    }
	};

	File dir = new File(path);
	if (dir.isDirectory()) {
	    File[] listFiles = dir.listFiles(filter);

	    if (listFiles.length > 0) {
		FileUtil fileUtil = new FileUtil();

		if (sortBy == SortBy.Filename) {
		    FilenameComparator comparer = fileUtil.new FilenameComparator(sortDirection);
		    Arrays.sort(listFiles, comparer);
		} else if (sortBy == SortBy.ModifiedTime) {
		    // System.out.println();
		    FileLastmodifiedComparator comparer = fileUtil.new FileLastmodifiedComparator(sortDirection);
		    Arrays.sort(listFiles, comparer);
		}
		for (File file : listFiles) {
		    resultList.add(file.getName());
		}
	    }

	}
	return resultList;
    }

    public static void saveFile(final String filename, final String path, final byte[] data) throws FileNotFoundException, IOException {
	String fullpath = path;
	// verify file path
	if (!fullpath.endsWith(File.separator)) {
	    fullpath += File.separator;
	}
	fullpath += filename;

	BufferedOutputStream out = new BufferedOutputStream(new FileOutputStream(fullpath));
	out.write(data);
	out.flush();
	out.close();
    }

    public static boolean checkFileExists(String filename, String filepath) {
	String srcFullpath = filepath;
	// verify file path
	if (!srcFullpath.endsWith(File.separator)) {
	    srcFullpath += File.separator;
	}
	srcFullpath += filename;
	File file = new File(srcFullpath);
	return file.exists();
    }

    public static boolean checkFileExists(String filenameWithPath) {
	String srcFullpath = filenameWithPath;
	File file = new File(srcFullpath);
	return file.exists();
    }

    public static byte[] getFileContent(String filename, String workingFilePath) throws IOException {
	String fullpath = workingFilePath;
	// verify file path
	if (!fullpath.endsWith(File.separator)) {
	    fullpath += File.separator;
	}
	fullpath += filename;
	BufferedInputStream in = new BufferedInputStream(new FileInputStream(fullpath));

	ByteArrayOutputStream out = new ByteArrayOutputStream();
	byte[] buffer = new byte[1024];
	int len = 0;
	while ((len = in.read(buffer)) > 0) {
	    out.write(buffer, 0, len);
	}
	// close file streams
	in.close();
	out.flush();
	out.close();

	return out.toByteArray();
    }

}
