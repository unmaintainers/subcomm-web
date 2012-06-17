package com.roylaurie;

import java.applet.Applet;
import java.io.IOException;
import java.security.AccessController;
import java.security.PrivilegedAction;
import java.util.HashMap;
import java.util.Map;
import java.util.logging.Logger;

import com.roylaurie.subcomm.SubcommClient;

public final class SubcommUIApplet extends Applet {
    private static final Logger LOG = Logger.getLogger(SubcommUIApplet.class.getCanonicalName());
    private static final long serialVersionUID = 1L;
    private static final String SUBCOMM_CONNECT = "SubcommConnect";
    private final Map<String, SubcommClient> mClientMap = new HashMap<String, SubcommClient>();
    private final Object mClientLock = new Object();
    
    public void connect(String id, String hostname, int port, String username, String password) {
        synchronized(mClientLock) {
            if (mClientMap.containsKey(id))
                return;
        }

        final String clientId = id;
        final SubcommClient client = new SubcommClient(hostname, port, username, password);
        Thread connectThread = new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    LOG.info("Connecting");
                    
                    AccessController.doPrivileged(
                        new PrivilegedAction<String>() {
                            public String run() {
                                try {
                                    client.connect();
                                } catch (IOException e) {
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
                    LOG.info("Connected");
                } catch (Exception e) {
                    if (client != null) {
                        client.disconnect();
                    }

                    throw new RuntimeException(e);
                }
            }
        });
        
        connectThread.setName(SUBCOMM_CONNECT);
        connectThread.start();
    }
    
    public SubcommClient getClient(String id) {
        synchronized(mClientLock) {
            return ( mClientMap.get(id) );
        }
    }
    
    @Override
    public void stop() {
        super.stop();
        synchronized(mClientLock) {
            for (SubcommClient client : mClientMap.values()) {
                client.disconnect();
            }
            
            mClientMap.clear();
        }
    }
}
