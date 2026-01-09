/**
 * UnityFX Security Trimming Pattern - PermissionChecker Utility
 * Pattern ID: UFX-SEC-TRIM-001
 * 
 * This utility provides centralized permission checking for SharePoint group membership
 * and site administrator permissions. Use this for client-side UI trimming only.
 * 
 * IMPORTANT: This is NOT server-side security. Always validate permissions on the server.
 * 
 * Usage:
 * 1. Copy this file to your project's src/utils/ directory
 * 2. Customize the group names and permission methods for your application
 * 3. Import and use in your components
 * 
 * Example:
 * ```typescript
 * import { PermissionChecker } from '../utils/PermissionChecker';
 * 
 * const result = await PermissionChecker.hasAdminPermissions(this.props.context);
 * if (result.isGroupMember) {
 *   // Show admin UI
 * }
 * ```
 */

import { SPHttpClient } from '@microsoft/sp-http';
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { SPPermission } from '@microsoft/sp-page-context';

/**
 * Result interface for permission checks
 */
export interface IPermissionCheckResult {
  isGroupMember: boolean;
  error?: string;
}

/**
 * Centralized permission checking utility for SharePoint group membership
 * and site administrator permissions.
 */
export class PermissionChecker {
  /**
   * Core method: Checks if the current user is a member of a specified SharePoint group
   * 
   * @param context - The WebPart context
   * @param groupName - The name of the SharePoint group to check
   * @returns Promise resolving to an object with the check result
   * 
   * API Endpoint: /_api/web/sitegroups/getByName('{groupName}')/Users?$filter=Title eq '{userName}'
   */
  public static async checkGroupMembership(
    context: WebPartContext,
    groupName: string
  ): Promise<IPermissionCheckResult> {
    try {
      const userName = context.pageContext.user.displayName;
      
      // Check if we have a valid username
      if (!userName) {
        console.log('User display name not available');
        return { 
          isGroupMember: false,
          error: 'User display name not available'
        };
      }

      // Log for debugging
      console.log(`Checking if user "${userName}" is a member of group "${groupName}"`);

      const groupUrl = `${context.pageContext.web.absoluteUrl}/_api/web/sitegroups/getByName('${groupName}')/Users?$filter=Title eq '${userName}'`;
      console.log('API URL:', groupUrl);

      const response = await context.spHttpClient.get(
        groupUrl,
        SPHttpClient.configurations.v1
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response not OK:', response.status, errorText);
        return { 
          isGroupMember: false,
          error: `HTTP error! status: ${response.status}`
        };
      }

      const data = await response.json();
      console.log('Permission check response:', data);
      
      const isGroupMember = data.value.length > 0;
      return { isGroupMember };
    } catch (error) {
      console.error('Error checking user permissions:', error);
      return { 
        isGroupMember: false,
        error: error.message
      };
    }
  }

  /**
   * Checks if the current user is a site administrator
   * 
   * Uses two-tier check:
   * 1. First checks SPPermission.manageWeb permission
   * 2. Falls back to checking "Site Owners" group membership
   * 
   * @param context - The WebPart context
   * @returns Promise resolving to an object with the check result
   */
  public static async isSiteAdmin(
    context: WebPartContext
  ): Promise<IPermissionCheckResult> {
    try {
      // First check if the user is directly marked as a site admin
      const isSiteAdmin = context.pageContext.web.permissions?.hasPermission(SPPermission.manageWeb);
      
      if (isSiteAdmin) {
        return { isGroupMember: true };
      }
      
      // If not directly a site admin, check if they're in the site admins group
      return this.checkGroupMembership(context, 'Site Owners');
    } catch (error) {
      console.error('Error checking site admin permissions:', error);
      return { 
        isGroupMember: false,
        error: error.message
      };
    }
  }

  /**
   * CUSTOMIZE THIS METHOD for your application's specific admin permission logic
   * 
   * Example: Check if user has admin permissions (either site admin OR custom group member)
   * 
   * @param context - The WebPart context
   * @returns Promise resolving to an object with the check result
   */
  public static async hasAdminPermissions(
    context: WebPartContext
  ): Promise<IPermissionCheckResult> {
    try {
      // Check if user is a site admin
      const siteAdminResult = await this.isSiteAdmin(context);
      if (siteAdminResult.isGroupMember) {
        return { isGroupMember: true };
      }
      
      // CUSTOMIZE: Add your custom group check here
      // Example: Check if they're in a custom admin group
      // return await this.checkGroupMembership(context, 'Your Custom Admin Group');
      
      // Default: Only site admins have admin permissions
      return { isGroupMember: false };
    } catch (error) {
      console.error('Error checking admin permissions:', error);
      return { 
        isGroupMember: false,
        error: error.message
      };
    }
  }

  // ========================================
  // ADD CUSTOM PERMISSION METHODS BELOW
  // ========================================

  /**
   * Example: Check if the current user is a member of a custom group
   * 
   * @param context - The WebPart context
   * @returns Promise resolving to an object with the check result
   */
  // public static async isCustomGroupMember(
  //   context: WebPartContext
  // ): Promise<IPermissionCheckResult> {
  //   return this.checkGroupMembership(context, 'Your Custom Group Name');
  // }
}

