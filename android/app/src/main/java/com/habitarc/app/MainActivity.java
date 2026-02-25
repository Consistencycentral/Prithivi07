package com.habitarc.app;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.graphics.Color;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.view.Window;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.ProgressBar;
import android.widget.Toast;

import androidx.swiperefreshlayout.widget.SwipeRefreshLayout;

public class MainActivity extends Activity {

    private WebView webView;
    private ProgressBar progressBar;
    private SwipeRefreshLayout swipeRefresh;

    // ─── Your live Netlify URL ───
    private static final String APP_URL = "https://habitarc-app.netlify.app/";

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Dark status & navigation bars
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        Window window = getWindow();
        window.setStatusBarColor(Color.parseColor("#0f172a"));
        window.setNavigationBarColor(Color.parseColor("#0f172a"));

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            window.setDecorFitsSystemWindows(true);
        }

        setContentView(R.layout.activity_main);

        webView = findViewById(R.id.webView);
        progressBar = findViewById(R.id.progressBar);
        swipeRefresh = findViewById(R.id.swipeRefresh);

        // ── WebView Settings ──
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);
        settings.setCacheMode(WebSettings.LOAD_DEFAULT);
        settings.setMediaPlaybackRequiresUserGesture(false);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
        settings.setUseWideViewPort(true);
        settings.setLoadWithOverviewMode(true);
        settings.setSupportZoom(false);
        settings.setBuiltInZoomControls(false);
        settings.setDisplayZoomControls(false);
        settings.setDatabaseEnabled(true);

        // Custom user agent
        String userAgent = settings.getUserAgentString();
        settings.setUserAgentString(userAgent + " HabitArcApp/1.0");

        // ── WebView Client ──
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                String url = request.getUrl().toString();
                // Keep all habitarc navigation inside the WebView
                if (url.contains("habitarc") || url.contains("netlify.app")) {
                    return false;
                }
                // Open external links in the WebView too (or use Intent for external browser)
                return false;
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
                progressBar.setVisibility(View.GONE);
                swipeRefresh.setRefreshing(false);
            }

            @Override
            public void onReceivedError(WebView view, int errorCode, String description, String failingUrl) {
                super.onReceivedError(view, errorCode, description, failingUrl);
                // Show error message if page fails to load
                Toast.makeText(MainActivity.this, "Please check your internet connection", Toast.LENGTH_LONG).show();
            }
        });

        // ── Progress bar ──
        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onProgressChanged(WebView view, int newProgress) {
                progressBar.setProgress(newProgress);
                if (newProgress == 100) {
                    progressBar.setVisibility(View.GONE);
                } else {
                    progressBar.setVisibility(View.VISIBLE);
                }
            }
        });

        // ── Pull to refresh ──
        swipeRefresh.setColorSchemeColors(
                Color.parseColor("#6366f1"),
                Color.parseColor("#a78bfa"),
                Color.parseColor("#8b5cf6")
        );
        swipeRefresh.setProgressBackgroundColorSchemeColor(Color.parseColor("#1e293b"));
        swipeRefresh.setOnRefreshListener(() -> webView.reload());

        // Set background to match app theme
        webView.setBackgroundColor(Color.parseColor("#0f172a"));

        // Check internet and load
        if (isNetworkAvailable()) {
            webView.loadUrl(APP_URL);
        } else {
            Toast.makeText(this, "No internet connection. Please connect and try again.", Toast.LENGTH_LONG).show();
            webView.loadData(
                "<html><body style='background:#0f172a;color:#94a3b8;display:flex;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;margin:0;text-align:center;'>" +
                "<div><h2 style='color:#818cf8;'>No Internet</h2><p>Please connect to the internet and reopen the app.</p></div>" +
                "</body></html>",
                "text/html", "UTF-8"
            );
        }
    }

    private boolean isNetworkAvailable() {
        ConnectivityManager cm = (ConnectivityManager) getSystemService(CONNECTIVITY_SERVICE);
        NetworkInfo activeNetwork = cm.getActiveNetworkInfo();
        return activeNetwork != null && activeNetwork.isConnectedOrConnecting();
    }

    @Override
    public void onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }
}
