"use client";

import * as React from "react";
import {
  Breadcrumbs as MUIBreadcrumbs,
  Link as MUILink,
  Typography,
  Box,
  type BreadcrumbsProps as MUIBreadcrumbsProps,
  type SxProps,
  type Theme,
} from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import HomeIcon from "@mui/icons-material/Home";

/**
 * Individual breadcrumb item configuration.
 */
export type BreadcrumbItem = {
  /** Display label for the breadcrumb */
  label: string;
  /** Optional href for the breadcrumb link (omit for current page) */
  href?: string;
  /** Optional icon to display before the label */
  icon?: React.ReactNode;
  /** Optional title/tooltip text for the breadcrumb */
  title?: string;
  /** If true, adds `target="_blank"` and `rel="noopener noreferrer"` for external links */
  external?: boolean;
};

/**
 * Props for the Breadcrumbs component.
 */
export type BreadcrumbsProps = {
  /** Array of breadcrumb items to display */
  items: BreadcrumbItem[];
  /** Custom link component (e.g., Next.js `Link` or React Router `Link`) */
  LinkComponent?: React.ElementType;
  /** Props to pass through to the underlying MUI Breadcrumbs component */
  muiProps?: Omit<MUIBreadcrumbsProps, "children">;
  /** Custom separator icon/node between breadcrumb items */
  separatorIcon?: React.ReactNode;
  /** Label that triggers the home icon display (default: "Home") */
  homeLabel?: string;
  /** ARIA label for the breadcrumb navigation (default: "Breadcrumb") */
  ariaLabel?: string;
  /** If true, reduces spacing between items for a more compact display */
  dense?: boolean;

  /** Custom styles for the root breadcrumbs container */
  sx?: SxProps<Theme>;
  /** Custom styles applied to all breadcrumb items */
  itemSx?: SxProps<Theme>;
  /** Custom styles applied to breadcrumb links */
  linkSx?: SxProps<Theme>;
  /** Custom styles applied to the current (last) breadcrumb item */
  currentSx?: SxProps<Theme>;
  /** Custom styles for the content wrapper (icon + label) */
  contentSx?: SxProps<Theme>;
  /** Custom styles for breadcrumb icons */
  iconSx?: SxProps<Theme>;
  /** Custom styles for breadcrumb labels */
  labelSx?: SxProps<Theme>;
};

const sxJoin = (...parts: Array<SxProps<Theme> | undefined>): SxProps<Theme> =>
  parts.filter(Boolean) as SxProps<Theme>;

/**
 * Breadcrumbs component built on MUI with Next.js and React Router support.
 *
 * @param props - Breadcrumbs configuration props
 * @returns A fully accessible breadcrumb navigation component
 *
 * @example
 * ```tsx
 * import Link from "next/link";
 * import { Breadcrumbs } from "@ameshkin/nextcrumbs";
 *
 * function MyBreadcrumbs() {
 *   return (
 *     <Breadcrumbs
 *       LinkComponent={Link}
 *       items={[
 *         { label: "Home", href: "/" },
 *         { label: "Products", href: "/products" },
 *         { label: "New Product" }
 *       ]}
 *     />
 *   );
 * }
 * ```
 */
export default function Breadcrumbs({
                                      items,
                                      LinkComponent = MUILink,
                                      muiProps,
                                      separatorIcon = <ChevronRightIcon fontSize="small" />,
                                      homeLabel = "Home",
                                      ariaLabel = "Breadcrumb",
                                      dense = false,
                                      sx,
                                      itemSx,
                                      linkSx,
                                      currentSx,
                                      contentSx,
                                      iconSx,
                                      labelSx,
                                    }: BreadcrumbsProps) {
  const safeItems = Array.isArray(items) ? items : [];
  const lastIndex = safeItems.length - 1;

  const defaultRootSx: SxProps<Theme> = {
    mb: 2,
    "& .MuiBreadcrumbs-li": { display: "flex", alignItems: "center" },
    "& .MuiTypography-root, a": { fontSize: 14, lineHeight: 1.2 },
    ...(dense && { "& .MuiBreadcrumbs-ol": { gap: 0.5 } }),
  };

  const defaultItemSx: SxProps<Theme> = {
    display: "inline-flex",
    alignItems: "center",
  };

  const defaultLinkSx: SxProps<Theme> = {
    textDecoration: "none",
    color: "primary.main",
    "&:hover": { textDecoration: "underline" },
  };

  const defaultCurrentSx: SxProps<Theme> = { color: "text.secondary" };

  const defaultContentSx: SxProps<Theme> = {
    display: "inline-flex",
    alignItems: "center",
    gap: 0.5,
  };

  const Content = ({
                     icon,
                     label,
                     title,
                   }: {
    icon?: React.ReactNode;
    label: string;
    title?: string;
  }) => (
    <Box component="span" sx={sxJoin(defaultContentSx, contentSx)} title={title || label}>
      {icon && <Box component="span" sx={iconSx}>{icon}</Box>}
      <Typography component="span" sx={labelSx}>{label}</Typography>
    </Box>
  );

  const renderCrumb = (item: BreadcrumbItem, index: number) => {
    const isLast = index === lastIndex;
    const isLink = !!item.href && !isLast;
    // BUG-026: Add runtime validation for label to prevent TypeError
    const labelStr = typeof item.label === "string" ? item.label : "";
    const isHome = item.href === "/" || (labelStr && labelStr.toLowerCase() === homeLabel.toLowerCase());
    const icon = item.icon ?? (isHome ? <HomeIcon color="primary" sx={{ fontSize: 18 }} /> : null);
    const label = isHome ? homeLabel : labelStr;
    // BUG-024: Add fallback for key to prevent 'undefined' or 'null' strings
    const key = `${index}-${item.href || labelStr || "item"}`;

    if (isLink) {
      return (
        <MUILink
          key={key}
          component={LinkComponent}
          href={item.href}
          sx={sxJoin(defaultLinkSx, linkSx, itemSx)}
          {...(item.external ? { rel: "noopener noreferrer", target: "_blank" } : {})}
        >
          <Content icon={icon} label={label} title={item.title} />
        </MUILink>
      );
    }

    return (
      <Typography
        key={key}
        component="span"
        aria-current={isLast ? "page" : undefined}
        sx={sxJoin(defaultCurrentSx, currentSx, itemSx)}
      >
        <Content icon={icon} label={label} title={item.title} />
      </Typography>
    );
  };

  return (
    <MUIBreadcrumbs
      aria-label={ariaLabel}
      separator={separatorIcon}
      sx={sxJoin(defaultRootSx, sx)}
      {...muiProps}
    >
      {safeItems.map(renderCrumb)}
    </MUIBreadcrumbs>
  );
}
