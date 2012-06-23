package com.roylaurie.subcomm.ui.web;

import java.applet.Applet;
import java.io.IOException;
import java.security.AccessController;
import java.security.PrivilegedAction;
import java.util.HashMap;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

import com.roylaurie.subcomm.client.SubcommNetchatClient;

public final class SubcommUIApplet extends Applet {
    private static final Logger LOG = Logger.getLogger(SubcommUIApplet.class.getCanonicalName());
    private static final long serialVersionUID = 1L;
    private static final String SUBCOMM_CONNECT = "SubcommConnect";
    private final Map<String, SubcommNetchatClient> mClientMap = new HashMap<String, SubcommNetchatClient>();
    private final Object mClientLock = new Object();
    
    public void connect(String id, String hostname, int port, String username, String password) {
        synchronized(mClientLock) {
            if (mClientMap.containsKey(id))
                return;
        }

        final String clientId = id;
        final SubcommNetchatClient client = new SubcommNetchatClient(hostname, port, username, password);
        final String uri = username + '@' + hostname + ':' + port + '#' + id;
        Thread connectThread = new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    LOG.info("Connecting to `" + uri + "`.");
                    
                    AccessController.doPrivileged(
                        new PrivilegedAction<String>() {
                            public String run() {
                                try {
                                    client.connect();
                                    if (!client.connected()) {
                                        throw new IOException("Client not connected after connect()!");
                                    }
                                    
                                    LOG.info("Connected to `" + uri + "`.");
                                } catch (IOException e) {
                                    LOG.log(Level.SEVERE, "Failed to connect to `" + uri + "`.", e);
                                    throw new RuntimeException(e);
                                }

                                return "";
                            }
                        }
                    );
                    

                    
                    client.joinDefaultArena();
                    synchronized(mClientLock) {
                        mClientMap.put(clientId, client);
                    }
                } catch (Exception e) {
                    if (client != null) {
                        client.disconnect();
                    }
                    
                    LOG.log(Level.SEVERE, "Failed to connect to `" + uri + "`.", e);
                    throw new RuntimeException(e);
                }
            }
        });
        
        connectThread.setName(SUBCOMM_CONNECT);
        connectThread.start();
    }
    
    public SubcommNetchatClient getClient(String id) {
        synchronized(mClientLock) {
            return ( mClientMap.get(id) );
        }
    }
    
    @Override
    public void stop() {
        LOG.info("STOP");
        super.stop();
        synchronized(mClientLock) {
            for (SubcommNetchatClient client : mClientMap.values()) {
                final String uri = client.getUsername() + '@' + client.getUsername() + ':' + client.getUsername();
                client.disconnect();
                LOG.info("Disconnected client `" + uri + "`.");
            }
            
            mClientMap.clear();
        }
    }
}
