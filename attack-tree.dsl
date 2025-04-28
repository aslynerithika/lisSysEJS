workspace "Library Management System - Attack Tree" {

    model {
        attacker = person "Malicious Actor" "An attacker targeting the library system"

        group "Attack Tree" {
            # Level 1: Main Attack Goal
            compromiseSystem = softwareSystem "Compromising Library Management System" {
                # Level 1.1: Unauthorized System Access
                unauthorizedAccess = container "Unauthorized System Access" {
                    socialEngineering = component "Social Engineering Attacks" {
                        # Level 1.1.1 details
                        properties {
                            "1.1.1.1" "Impersonating IT support"
                            "1.1.1.2" "Fake maintenance emails"
                            "1.1.1.3" "Exploiting trust relationships"
                        }
                    }
                    credentialHarvesting = component "Credential Harvesting" {
                        # Level 1.1.2 details
                        properties {
                            "1.1.2.1" "Fake login portals"
                            "1.1.2.2" "Phishing emails"
                            "1.1.2.3" "Rogue WiFi networks"
                        }
                    }
                }

                # Level 1.2: System Infrastructure Attacks
                infrastructureAttacks = container "System Infrastructure Attacks" {
                    databaseExploit = component "Database Exploitation" {
                        properties {
                            "1.2.1.1" "SQL injection attacks"
                            "1.2.1.2" "Direct DB connection exploits"
                            "1.2.1.3" "Backup process manipulation"
                        }
                    }
                    applicationLayer = component "Application Layer Attacks" {
                        properties {
                            "1.2.2.1" "Unprotected API endpoints"
                            "1.2.2.2" "Session token manipulation"
                            "1.2.2.3" "Client-side validation bypass"
                        }
                    }
                }

                # Level 1.3: Malicious Software
                malwareDeploy = container "Malicious Software Deployment" {
                    publicAccess = component "Public Access Point Exploitation" {
                        properties {
                            "1.3.1.1" "Keylogger installation"
                            "1.3.1.2" "Screen capture malware"
                            "1.3.1.3" "Network traffic sniffing"
                        }
                    }
                    staffSystem = component "Staff System Compromise" {
                        properties {
                            "1.3.2.1" "Admin workstation targeting"
                            "1.3.2.2" "Software vulnerability exploits"
                            "1.3.2.3" "Ransomware deployment"
                        }
                    }
                }

                # Level 1.4: Service Disruption
                serviceDisruption = container "Service Disruption" {
                    resourceExhaustion = component "Resource Exhaustion" {
                        properties {
                            "1.4.1.1" "Authentication endpoint flooding"
                            "1.4.1.2" "Search functionality overload"
                            "1.4.1.3" "Fake request generation"
                        }
                    }
                    systemStability = component "System Stability Attacks" {
                        properties {
                            "1.4.2.1" "Memory leak exploitation"
                            "1.4.2.2" "Expensive query triggers"
                            "1.4.2.3" "Configuration corruption"
                        }
                    }
                }

                # Level 1.5: Insider Threats
                insiderThreats = container "Insider Exploitation" {
                    privilegeAbuse = component "Privilege Abuse" {
                        properties {
                            "1.5.1.1" "Admin access misuse"
                            "1.5.1.2" "Unauthorized account creation"
                            "1.5.1.3" "Access control modification"
                        }
                    }
                    dataManipulation = component "Data Manipulation" {
                        properties {
                            "1.5.2.1" "Borrowing record alteration"
                            "1.5.2.2" "Fine calculation tampering"
                            "1.5.2.3" "Membership status falsification"
                        }
                    }
                }
            }
        }

        # Attack relationships
        attacker -> unauthorizedAccess "initiates"
        attacker -> infrastructureAttacks "executes"
        attacker -> malwareDeploy "deploys"
        attacker -> serviceDisruption "triggers"
        attacker -> insiderThreats "exploits"
    }

    views {
        systemContext compromiseSystem "AttackTreeContext" {
            include *
            autoLayout
        }

        container compromiseSystem "AttackTreeContainers" {
            include *
            autoLayout
        }

        component unauthorizedAccess "UnauthorizedAccessComponents" {
            include *
            autoLayout
        }

        styles {
            element "Attacker" {
                background #ff0000
                color #ffffff
                shape Person
            }
            element "Attack Vector" {
                background #ff6666
                color #ffffff
            }
            element "Component" {
                background #ff9999
                color #000000
            }
            element "Container" {
                background #ffcccc
                color #000000
            }
        }

        theme default
    }
} 